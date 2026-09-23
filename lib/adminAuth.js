import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Admin docs are keyed by lowercase email — this lets you add a teammate
// as admin before they've ever signed in (no UID lookup needed).

export async function checkIsAdmin(email) {
  if (!email) return false;
  const snap = await getDoc(doc(db, "admins", email.toLowerCase()));
  return snap.exists();
}

export async function getAllAdmins() {
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map((d) => d.data());
}

export async function addAdmin({ email, addedByEmail }) {
  const id = email.trim().toLowerCase();
  await setDoc(doc(db, "admins", id), {
    email: id,
    addedBy: addedByEmail,
    addedAt: serverTimestamp(),
  });
}

export async function removeAdmin(email) {
  await deleteDoc(doc(db, "admins", email.toLowerCase()));
}
