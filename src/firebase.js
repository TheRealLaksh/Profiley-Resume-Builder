import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc } from "firebase/firestore";

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

export const saveResumeToDB = async (resumeData) => {
  try {
    // 1. Sanitize: Remove 'undefined' values which cause Firestore to crash
    const cleanData = JSON.parse(JSON.stringify(resumeData));

    // 2. Size Check: Firestore document limit is 1MB (1,048,576 bytes)
    // We check the size of the stringified JSON to catch large images early
    const payloadSize = new Blob([JSON.stringify(cleanData)]).size;
    
    if (payloadSize > 950000) { // Limit to ~950KB to be safe
        throw new Error("Profile is too large (Max 1MB). Please remove the photo or use a smaller image.");
    }

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