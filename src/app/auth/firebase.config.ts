// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDibcwSNV2eTtTKy7BxZHFmO1prL6upn1k",
  authDomain: "mymessages-385813.firebaseapp.com",
  projectId: "mymessages-385813",
  storageBucket: "mymessages-385813.appspot.com",
  messagingSenderId: "509113508042",
  appId: "1:509113508042:web:aaf80881b269195ced1433",
  measurementId: "G-0VJ2TDJY6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
