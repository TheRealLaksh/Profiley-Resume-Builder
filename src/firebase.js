import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore"; // Added setDoc

const firebaseConfig = {
  apiKey: "AIzaSyDfSuJZtkW0kTklIWIVR0sIrcbDXcwKoVM",
  authDomain: "profiley-76c8a.firebaseapp.com",
  projectId: "profiley-76c8a",
  storageBucket: "profiley-76c8a.firebasestorage.app",
  messagingSenderId: "990826506770",
  appId: "1:990826506770:web:d6eb3f063c76143bd306cb",
  measurementId: "G-DDZ7RWY75E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save with Auto-ID (Random)
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

// NEW: Save with Custom Slug
export const saveResumeWithSlug = async (slug, resumeData) => {
  try {
    const cleanData = JSON.parse(JSON.stringify(resumeData));
    const payloadSize = new Blob([JSON.stringify(cleanData)]).size;
    if (payloadSize > 950000) throw new Error("Profile is too large (Max 1MB).");

    const docRef = doc(db, "resumes", slug);
    
    // Check if taken
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      throw new Error("URL unavailable");
    }

    // Save with custom ID
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