// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC92G1LybSWu3463j1Wi0yjZaTzuiHcIMk",
  authDomain: "autocert-8319d.firebaseapp.com",
  projectId: "autocert-8319d",
  storageBucket: "autocert-8319d.firebasestore.app",
  messagingSenderId: "941021055631",
  appId: "1:941021055631:web:4e08a4a0c145a53242fefa",
  measurementId: "G-RELBKEDZLJ"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, db, analytics };