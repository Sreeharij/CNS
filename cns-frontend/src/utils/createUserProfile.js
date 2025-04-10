import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config"; 

export const createUserProfileIfNotExists = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email || "",
      favorites: [],
      createdAt: new Date(),
    });
  }
};
