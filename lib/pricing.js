import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Seeds pricing/tlds the first time it's read, and is the fallback for any
// TLD the admin hasn't touched yet.
const DEFAULT_PRICES = {
  com: 12.99, net: 14.99, org: 13.99, io: 39.99, ai: 79.99,
  xyz: 2.99, art: 6.99, dev: 15.99, app: 15.99, co: 27.99,
  info: 12.99, online: 34.99, store: 4.99, live: 24.99, in: 8.99,
  tech: 24.99, shop: 24.99, site: 19.99, me: 19.99, biz: 14.99,
  vu: 89.99, ru: 39.99, td: 149.99, tv: 34.99, cc: 29.99,
  ws: 44.99, to: 79.99, gg: 54.99, sh: 59.99, fm: 99.99,
  la: 44.99, im: 44.99, je: 44.99, cx: 64.99, nu: 44.99,
};

export async function getTldPrices() {
  const snap = await getDoc(doc(db, "pricing", "tlds"));
  if (snap.exists()) {
    const { updatedAt, updatedBy, ...prices } = snap.data();
    return { ...DEFAULT_PRICES, ...prices };
  }
  return DEFAULT_PRICES;
}

export async function updateTldPrices(prices, updatedByEmail) {
  await setDoc(
    doc(db, "pricing", "tlds"),
    { ...prices, updatedAt: serverTimestamp(), updatedBy: updatedByEmail },
    { merge: true }
  );
}
