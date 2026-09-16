// =============================================
// FIREBASE CONFIGURATION
// Ganti dengan config Firebase project kamu!
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOsawtBrD5xsUzhjDktpc4JBJhmY7OTQQ",
  authDomain: "oprec-eeprom.firebaseapp.com",
  projectId: "oprec-eeprom",
  storageBucket: "oprec-eeprom.firebasestorage.app",
  messagingSenderId: "1095658083867",
  appId: "1:1095658083867:web:23d07c240621de32a7cabe",
  measurementId: "G-VZS8TWPRV8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Firestore Helpers ────────────────────────

/**
 * Tambah dokumen baru ke collection
 */
export async function addDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

/**
 * Set dokumen dengan ID tertentu
 */
export async function setDocument(collectionName, docId, data, merge = true) {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge });
}

/**
 * Get satu dokumen by ID
 */
export async function getDocument(collectionName, docId) {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Get semua dokumen dari collection
 */
export async function getCollection(collectionName, conditions = [], orderByField = null, limitCount = null) {
  let q = collection(db, collectionName);

  const constraints = [];
  conditions.forEach(([field, op, value]) => {
    constraints.push(where(field, op, value));
  });
  if (orderByField) constraints.push(orderBy(orderByField, 'desc'));
  if (limitCount) constraints.push(limit(limitCount));

  if (constraints.length > 0) {
    q = query(q, ...constraints);
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Update dokumen by ID
 */
export async function updateDocument(collectionName, docId, data) {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete dokumen by ID
 */
export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

// ─── Auth Helpers ─────────────────────────────

export async function adminLogin(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  return await signOut(auth);
}

export function onAdminAuthStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function createAdminUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// ─── Exports ──────────────────────────────────
export { db, auth, collection, doc, getDocs, query, where, orderBy, serverTimestamp };
