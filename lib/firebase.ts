import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { updateProfile } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

import { DocumentPickerAsset } from "expo-document-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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

export async function getVideosByUser(
  userID: string | undefined
): Promise<Array<Video> | undefined> {
  try {
    const videosCollection = collection(FIREBASE_DB, "document");
    const videosQuery = query(videosCollection, where("creator", "==", userID));

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

export const uploadToFirebase = async (uri: string, type: string) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  const name = uuidv4();
  const folder = type === "image" ? "images/" : "videos/";
  const imageRef = ref(getStorage(), `${folder}${name}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
};

export const createPost = async (video: Video) => {
  try {
    const auth = FIREBASE_AUTH;
    const videosRef = collection(FIREBASE_DB, "document");

    const docRef = await addDoc(videosRef, {
      title: video.title,
      prompt: video.prompt,
      video: video.video,
      thumbnail: video.thumbnail,
      creator: auth.currentUser?.uid,
    });

    console.log("Video document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding video document: ", error);
    throw error;
  }
};

export const getSavedVideos = async () => {
  try {
    const auth = FIREBASE_AUTH;
    const userUid = auth.currentUser?.uid;

    if (!userUid) {
      throw new Error("User is not authenticated");
    }

    const bookmarksRef = collection(FIREBASE_DB, "bookmark");

    const q = query(bookmarksRef, where("owner", "==", userUid));

    const querySnapshot = await getDocs(q);

    const savedVideos: Video[] = [];

    for (const bookmarkDoc of querySnapshot.docs) {
      const bookmarkData = bookmarkDoc.data();
      const videoRef = bookmarkData.video;

      if (videoRef) {
        const videoDoc = await getDoc(videoRef);

        if (videoDoc.exists()) {
          const videoData = videoDoc.data() as Video;

          savedVideos.push(videoData);
        }
      }
    }

    return savedVideos;
  } catch (error) {
    console.error("Error fetching saved videos: ", error);
    throw error;
  }
};
