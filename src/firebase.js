// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
const auth = getAuth(app);
const db = getFirestore(app);

// 소셜 로그인 제공자 초기화
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// 소셜 로그인 함수
const signInWithGoogle = async () => {
  try {
    console.log('Google 로그인 시도...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google 로그인 성공:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    throw error;
  }
};

const signInWithFacebook = async () => {
  try {
    console.log('Facebook 로그인 시도...');
    const result = await signInWithPopup(auth, facebookProvider);
    console.log('Facebook 로그인 성공:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Facebook 로그인 오류:', error);
    throw error;
  }
};

const signInWithApple = async () => {
  try {
    console.log('Apple 로그인 시도...');
    const result = await signInWithPopup(auth, appleProvider);
    console.log('Apple 로그인 성공:', result.user.uid);
    return result.user;
  } catch (error) {
    console.error('Apple 로그인 오류:', error);
    throw error;
  }
};

export { 
  app, 
  analytics, 
  auth, 
  db, 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithApple 
}; 