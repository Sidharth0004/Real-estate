// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  apiKey: "AIzaSyCIojJvb4lkSr3yqQVBKXw0mR1v7KEJdbM" ,
  authDomain: "mern-estate-2c46d.firebaseapp.com",
  projectId: "mern-estate-2c46d",
  storageBucket: "mern-estate-2c46d.appspot.com",
  messagingSenderId: "91937999651",
  appId: "1:91937999651:web:653e226206c9b2e3a3da96",
  measurementId: "G-ZMMFN1YKC9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);