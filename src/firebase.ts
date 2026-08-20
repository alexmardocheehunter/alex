import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxUoKdufBnCKr6JQwjrtu7o1kKSUeCodc",
  authDomain: "alexmardochee.firebaseapp.com",
  projectId: "alexmardochee",
  storageBucket: "alexmardochee.firebasestorage.app",
  messagingSenderId: "868612303887",
  appId: "1:868612303887:web:5d4b5e7987a15f8cdf077a",
  measurementId: "G-7TG7XC69LK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (safely)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
