import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { updateProfile } from "firebase/auth";

export type Video = {
  id: string;
  creator: string;
  displayName?: string;
  title: string;
  prompt: string;
  thumbnail: string;
  video: string;
};

export async function getVideos(): Promise<Array<Video> | undefined> {
  try {
    const videosCollection = collection(FIREBASE_DB, "document");

    const querySnapshot = await getDocs(videosCollection);

    const videos = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        let displayName = "";
        if (data.creator) {
          const userDocRef = doc(FIREBASE_DB, "users", data.creator);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            displayName = userData?.displayName ?? "";
          } else {
            console.warn(
              `User document for creator ${data.creator} does not exist.`
            );
          }
        } else {
          console.warn(
            `Video document ${docSnapshot.id} has no creator field.`
          );
        }

        return {
          id: docSnapshot.id,
          creator: data.creator ?? "",
          displayName,
          title: data.title ?? "",
          prompt: data.prompt ?? "",
          thumbnail: data.thumbnail ?? "",
          video: data.video ?? "",
        };
      })
    );

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}

export async function getVideosByTitle(
  searchQuery: string
): Promise<Array<Video> | undefined> {
  try {
    const videosCollection = collection(FIREBASE_DB, "document");
    const videosQuery = query(
      videosCollection,
      where("title", ">=", searchQuery.toLowerCase()),
      where("title", "<=", searchQuery.toLowerCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(videosQuery);

    const videos = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        let displayName = "";
        if (data.creator) {
          const userDocRef = doc(FIREBASE_DB, "users", data.creator);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            displayName = userData?.displayName ?? "";
          } else {
            console.warn(
              `User document for creator ${data.creator} does not exist.`
            );
          }
        } else {
          console.warn(
            `Video document ${docSnapshot.id} has no creator field.`
          );
        }

        return {
          id: docSnapshot.id,
          creator: data.creator ?? "",
          displayName,
          title: data.title ?? "",
          prompt: data.prompt ?? "",
          thumbnail: data.thumbnail ?? "",
          video: data.video ?? "",
        };
      })
    );

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
}
