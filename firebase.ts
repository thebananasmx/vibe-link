// FIX: Updated to use Firebase v8 namespaced/compat API to resolve import errors.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// TODO: Replace this with your own Firebase project configuration.
// You can get this from the Firebase Console:
// Go to Project settings > General tab.
// In the "Your apps" card, select the web app for this project.
// Select "Config" to view your app's Firebase configuration object.
const firebaseConfig = {
  apiKey: "AIzaSyBehglxtItCovrix-0I3uatJ6-hQzHzM-A",
  authDomain: "vibe-link-10.firebaseapp.com",
  projectId: "vibe-link-10",
  storageBucket: "vibe-link-10.appspot.com",
  messagingSenderId: "1081281346620",
  appId: "1:1081281346620:web:dd29db32f10974a34a1739",
  measurementId: "G-END2D7WPP6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();