import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC__FIREBASE_apikey,
  authDomain: process.env.NEXT_PUBLIC__FIREBASE_authDomain,
  projectId: process.env.NEXT_PUBLIC__FIREBASE_projectId,
  storageBucket: process.env.NEXT_PUBLIC__FIREBASE_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC__FIREBASE_messagingSenderId,
  appId: process.env.NEXT_PUBLIC__FIREBASE_appId,
  measurementId: process.env.NEXT_PUBLIC__FIREBASE_measurementId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }