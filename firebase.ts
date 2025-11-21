// FIX: Updated to use Firebase v8 namespaced/compat API to resolve import errors.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBehglxtItCovrix-0I3uatJ6-hQzHzM-A",
  authDomain: "vibe-link-10.firebaseapp.com",
  projectId: "vibe-link-10",
  storageBucket: "vibe-link-10.firebasestorage.app",
  messagingSenderId: "1081281346620",
  appId: "1:1081281346620:web:dd29db32f10974a34a1739",
  measurementId: "G-END2D7WPP6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();