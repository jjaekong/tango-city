// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLwrazIKfn1qyII1Tgq4TWeKO_v_RXaMA",
  authDomain: "tango-city-24.firebaseapp.com",
  projectId: "tango-city-24",
  storageBucket: "tango-city-24.appspot.com",
  messagingSenderId: "293276716331",
  appId: "1:293276716331:web:51cb79948d4193815a496e",
  measurementId: "G-WMPJ5S2MGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);