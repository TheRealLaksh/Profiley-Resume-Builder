import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc, runTransaction } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore documents are capped at 1 MiB; leave headroom for createdAt.
const MAX_PAYLOAD_BYTES = 950000;

// Firestore reserves ids shaped like __name__.
const RESUME_ID_PATTERN = /^(?!__.*__$)[A-Za-z0-9_-]{1,64}$/;

// Paths the site itself serves or may serve; they must never become resume links.
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'app', 'assets', 'editor', 'favicon', 'index', 'login', 'new',
  'og-image', 'robots', 'signup', 'sitemap', 'static', 'vite'
]);

/** Whether a URL path segment can be a resume id (avoids Firestore lookups for /robots.txt, /assets/x.js, ...). */
export const isValidResumeId = (id) => typeof id === 'string' && RESUME_ID_PATTERN.test(id);

export const makeSlug = (input) =>
  input.trim().replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 64);

const buildPayload = (resumeData, tooLargeMessage) => {
  const cleanData = JSON.parse(JSON.stringify(resumeData));
  const payloadSize = new TextEncoder().encode(JSON.stringify(cleanData)).length;
  if (payloadSize > MAX_PAYLOAD_BYTES) throw new Error(tooLargeMessage);
  return { ...cleanData, createdAt: new Date().toISOString() };
};

export const saveResumeToDB = async (resumeData) => {
  const payload = buildPayload(resumeData, "Profile is too large (Max 1MB). Remove the photo or use a smaller one.");
  const docRef = await addDoc(collection(db, "resumes"), payload);
  return docRef.id;
};

export const saveResumeWithSlug = async (slug, resumeData) => {
  if (!isValidResumeId(slug)) throw new Error("That URL isn't valid. Use letters, numbers, - or _.");
  if (RESERVED_SLUGS.has(slug.toLowerCase())) throw new Error("URL unavailable");

  const payload = buildPayload(resumeData, "Profile is too large (Max 1MB). Remove the photo or use a smaller one.");
  const docRef = doc(db, "resumes", slug);

  // Check-and-create in one transaction so two people can't claim the same slug.
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    if (snapshot.exists()) throw new Error("URL unavailable");
    transaction.set(docRef, payload);
  });
  return slug;
};

/**
 * Resolves to the stored resume, or null when it doesn't exist.
 * Network/permission failures reject, so callers can tell "missing" from "couldn't load".
 */
export const fetchResumeFromDB = async (id) => {
  if (!isValidResumeId(id) || RESERVED_SLUGS.has(id.toLowerCase())) return null;
  const docSnap = await getDoc(doc(db, "resumes", id));
  return docSnap.exists() ? docSnap.data() : null;
};
