import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Get a Firestore instance
export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC9UksAfuE2u48JTwfxW_eSjXfV5sPvQjU",
  authDomain: "heimr-chars.firebaseapp.com",
  databaseURL: "https://heimr-chars.firebaseio.com",
  projectId: "heimr-chars",
  storageBucket: "heimr-chars.appspot.com",
  messagingSenderId: "409786001633",
  appId: "1:409786001633:web:3c496047b36c83d5306fa0",
  measurementId: "G-YZ5QQN5LXP"
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
