import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAuth, GoogleAuthProvider, signInAnonymously, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const initAuthPersistence = () => {
  return setPersistence(auth, browserLocalPersistence);
};


const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Add user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        authProvider: 'google',
      });
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// Email/Password Sign-Up
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      authProvider: 'local',
    });
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// Email/Password Sign-In
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// Logout
const logout = () => {
  signOut(auth);
};


export const db = getFirestore(app);
export const storage = getStorage(app);
export default app; // <-- Now you can import `app` elsewhere
export { auth, googleProvider, signInAnonymously };
export {
  signInWithGoogle,
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
  logout,
};