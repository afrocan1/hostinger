import { adminAuth, adminDb, FieldValue } from "@/lib/firebaseAdmin";
import { findPayment } from "@/lib/chainCheck";
import { CHAINS } from "@/lib/chains";

const WINDOW_MS = 65 * 60 * 1000;

// If useUserCollection reads from a different path, change ONLY this line.
const userCol = (uid, name) => adminDb.collection("users").doc(uid).collection(name);

const isoDate = (d) => d.toISOString().slice(0, 10);
const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

async function fulfill(orderRef, order, chainKey, txHash) {
  const payRef = adminDb.collection("payments").doc(txHash);
  const now = new Date();

  await adminDb.runTransaction(async (t) => {
    const o = await t.get(orderRef);
    const p = await t.get(payRef);
    if (o.data().status === "paid") return;
    if (p.exists) throw new Error("Transaction already used for another order");

    t.update(orderRef, {
      status: "paid",
      txHash,
      chain: chainKey,
      paidAt: FieldValue.serverTimestamp(),
    });
    t.set(payRef, { orderId: orderRef.id, uid: order.uid, chain: chainKey, createdAt: FieldValue.serverTimestamp() });

    for (const item of order.items) {
      if (item.type !== "domain") continue;
      const years = item.qty;
      t.set(userCol(order.uid, "domains").doc(), {
        name: item.name,
        status: "Active",
        expires: isoDate(addYears(now, years)), // next renewal date
        autoRenew: false,
        amountPaid: `$${(item.price * item.qty).toFixed(2)}`,
        renewalPrice: `$${item.price.toFixed(2)}`,
        years,
        purchasedAt: isoDate(now),
        orderId: orderRef.id,
        txHash,
        chain: chainKey,
      });
    }

    t.set(userCol(order.uid, "invoices").doc(), {
      invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
      amount: `$${order.subtotal.toFixed(2)}`,
      status: "Paid",
      date: isoDate(now),
      orderId: orderRef.id,
      txHash,
    });

    t.set(userCol(order.uid, "notifications").doc(), {
      message: `Payment received for order ${orderRef.id.slice(0, 8)}. Your purchase has been added to your account.`,
      date: isoDate(now),
    });
  });
}

export default async function handler(req, res) {
  let decoded;
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    decoded = await adminAuth.verifyIdToken(token);
  } catch (e) {
    return res.status(401).json({ error: "Not authorised" });
  }

  try {
    const { orderId, chain } = req.query;
    if (!CHAINS[chain]) return res.status(400).json({ error: "bad chain" });

    const orderRef = adminDb.collection("orders").doc(String(orderId));
    const snap = await orderRef.get();
    if (!snap.exists || snap.data().uid !== decoded.uid) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = snap.data();

    if (order.status === "paid") return res.status(200).json({ paid: true });
    if (Date.now() - order.createdMs > WINDOW_MS) return res.status(200).json({ paid: false, expired: true });

    const txHash = await findPayment(chain, Number(order.payAmount), order.createdMs - 120000);
    if (!txHash) return res.status(200).json({ paid: false });

    await fulfill(orderRef, order, chain, txHash);
    return res.status(200).json({ paid: true });
  } catch (e) {
    return res.status(200).json({ paid: false });
  }
}
