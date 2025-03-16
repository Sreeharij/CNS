import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const fetchLocations = async () => {
  const querySnapshot = await getDocs(collection(db, "locations"));
  return querySnapshot.docs.map(doc => doc.data());
};
