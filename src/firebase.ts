import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_MxbKTeix1A9fA8OqoyvsQGlqp3-x-Es",
  authDomain: "nutrify-22003.firebaseapp.com",
  projectId: "nutrify-22003",
  storageBucket: "nutrify-22003.firebasestorage.app",
  messagingSenderId: "602794074564",
  appId: "1:602794074564:web:fa36ab51335ee4316c4491",
  measurementId: "G-EZGYDJE0YZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);