import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./config"; // <-- Use db directly

export const saveRoute = async (userId, origin, destination) => {
  try {
    await addDoc(collection(db, "navigation_history"), {
      userId,
      origin,
      destination,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error saving route:", error);
  }
};

export const getUserRoutes = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, "navigation_history"));
    return querySnapshot.docs.map(doc => doc.data()).filter(route => route.userId === userId);
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
};
