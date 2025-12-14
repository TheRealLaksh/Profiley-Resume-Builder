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
    const docRef = await addDoc(collection(db, "resumes"), {
      ...resumeData,
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