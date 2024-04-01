import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

type FirebaseConfig = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId: string | undefined;
};

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAUUnBpzDISarL6nrWoTOs6iu4FdyoMvfM",
  authDomain: "finance-4825c.firebaseapp.com",
  projectId: "finance-4825c",
  storageBucket: "finance-4825c.appspot.com",
  messagingSenderId: "861033503956",
  appId: "1:861033503956:web:81a53cb0c1a6efc0ba2f41",
  measurementId: "G-5HLTWFGY21"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const firestore: Firestore = getFirestore(app);
const auth = getAuth(app);

export { app, auth, Firestore }; // Export Firestore type as well
