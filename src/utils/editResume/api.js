import { get, child, ref } from "firebase/database";
import { db } from "../../config/firebase";
export const fetchUserData = async (uid) => {
  if (!uid) return null;

  try {
    const snap = await get(child(ref(db), `users/${uid}`));

    if (!snap.exists()) return null;

    const data = snap.val();

    const projectsArray = Array.isArray(data?.projects)
      ? data.projects
      : data?.projects
      ? Object.values(data.projects)
      : [];

    const sanitized = {
      ...data,
      projects: projectsArray.map(({ image, ...rest }) => rest),
    };

    return sanitized;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

