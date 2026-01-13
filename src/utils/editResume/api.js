import { get, child, ref } from "firebase/database";
import { db } from "../../config/firebase"; // adjust path as needed

export const fetchUserData = async (uid) => {
  if (!uid) return null;

  try {
    const snap = await get(child(ref(db), `users/${uid}`));
    if (snap.exists()) {
      return snap.val();
    } else {
      return null;
    }
  } catch (error) {
    console.warn(error);
    return null;
  }
};
