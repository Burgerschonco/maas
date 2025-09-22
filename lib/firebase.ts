import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBpkmLCTCgLFx5XmeULi3zux38wPgI7-9w",
  authDomain: "maastakip-1ac0f.firebaseapp.com",
  databaseURL: "https://maastakip-1ac0f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "maastakip-1ac0f",
  storageBucket: "maastakip-1ac0f.firebasestorage.app",
  messagingSenderId: "418196685395",
  appId: "1:418196685395:web:aabbe5960e79689388bca6",
  measurementId: "G-VT8EK0FLKP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
