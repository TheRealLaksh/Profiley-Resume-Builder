import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";

// Use environment variables
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

// ... rest of your code remains the same ...
// (saveResumeToDB, saveResumeWithSlug, fetchResumeFromDB)
// ...
export const saveResumeToDB = async (resumeData) => {
  try {
    const cleanData = JSON.parse(JSON.stringify(resumeData));
    const payloadSize = new Blob([JSON.stringify(cleanData)]).size;
    if (payloadSize > 950000) throw new Error("Profile is too large (Max 1MB). Remove the photo or use a smaller one.");

    const docRef = await addDoc(collection(db, "resumes"), {
      ...cleanData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const saveResumeWithSlug = async (slug, resumeData) => {
  try {
    const cleanData = JSON.parse(JSON.stringify(resumeData));
    const payloadSize = new Blob([JSON.stringify(cleanData)]).size;
    if (payloadSize > 950000) throw new Error("Profile is too large (Max 1MB).");

    const docRef = doc(db, "resumes", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      throw new Error("URL unavailable");
    }

    await setDoc(docRef, {
      ...cleanData,
      createdAt: new Date().toISOString()
    });
    return slug;
  } catch (e) {
    throw e;
  }
};

export const fetchResumeFromDB = async (id) => {
  try {
    const docRef = doc(db, "resumes", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    return null;
  }
};