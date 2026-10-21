import { adminAuth, adminDb, FieldValue } from "@/lib/firebaseAdmin";

const WINDOW_MS = 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  let decoded;
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    decoded = await adminAuth.verifyIdToken(token);
  } catch (e) {
    return res.status(401).json({ error: "Please log in to continue." });
  }

  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const clean = items.map((i) => ({
      id: String(i.id),
      name: String(i.name),
      type: i.type || "other",
      price: Number(i.price),
      qty: Math.max(1, Math.floor(Number(i.qty) || 1)),
    }));
    if (!clean.length || clean.some((i) => !(i.price >= 0))) {
      return res.status(400).json({ error: "Invalid cart." });
    }

    const subtotal = Math.round(clean.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100;

    // Unique amount, not used by any other order still inside its payment window
    const pending = await adminDb.collection("orders").where("status", "==", "pending").get();
    const taken = new Set(
      pending.docs
        .filter((d) => Date.now() - d.data().createdMs < WINDOW_MS)
        .map((d) => d.data().payAmount)
    );
    let payAmount = null;
    for (let n = 0; n < 50; n++) {
      const unique = Math.floor(Math.random() * 999 + 1) / 100000;
      const candidate = (subtotal + unique).toFixed(5);
      if (!taken.has(candidate)) {
        payAmount = candidate;
        break;
      }
    }
    if (!payAmount) return res.status(503).json({ error: "Busy, please try again." });

    const ref = await adminDb.collection("orders").add({
      uid: decoded.uid,
      email: decoded.email || null,
      items: clean,
      subtotal,
      payAmount,
      status: "pending",
      createdMs: Date.now(),
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ orderId: ref.id, payAmount, subtotal });
  } catch (e) {
    return res.status(500).json({ error: "Could not create order." });
  }
}
