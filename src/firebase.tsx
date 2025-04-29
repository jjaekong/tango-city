// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCn7ScZpGTwcglWkDqRKT8dcfQD9Zgr5iE",
  authDomain: "tango-city-f4815.firebaseapp.com",
  projectId: "tango-city-f4815",
  storageBucket: "tango-city-f4815.firebasestorage.app",
  messagingSenderId: "930341104654",
  appId: "1:930341104654:web:78ff0ea6dcd7342efca05f",
  measurementId: "G-E6M97W35YQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Initialize Firebase Authentication and get a reference to the service
export const db = getFirestore(app); // Initialize Firestore and get a reference to the service
