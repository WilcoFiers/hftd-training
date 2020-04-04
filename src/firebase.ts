import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Get a Firestore instance
export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBweIFy5EWPrSRHtaMqRT6YThxsZfS96OU",
  authDomain: "hftd-training.firebaseapp.com",
  databaseURL: "https://hftd-training.firebaseio.com",
  projectId: "hftd-training",
  storageBucket: "hftd-training.appspot.com",
  messagingSenderId: "293633356436",
  appId: "1:293633356436:web:e05117aa442ec422b0fa81",
  measurementId: "G-B1XL40FS2X"
});

export const EmailAuthProvider = firebase.auth.EmailAuthProvider;
export const auth = firebaseApp.auth();

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export function createID(length = 20): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newId = "";
  for (let i = 0; i < length; i++) {
    newId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newId;
}
