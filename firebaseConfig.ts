// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPYkuaYJP3dkghddBjHhCd2LFZSWK4Mr0",
  authDomain: "learnreactnative-25160.firebaseapp.com",
  projectId: "learnreactnative-25160",
  storageBucket: "learnreactnative-25160.appspot.com",
  messagingSenderId: "801134440599",
  appId: "1:801134440599:web:565ec1005b16270c5cb9d2",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_DB = getFirestore();
