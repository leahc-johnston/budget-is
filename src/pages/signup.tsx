import React, { useState, useEffect } from "react";
import { auth, firestore } from "../components/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore"; // Import addDoc and collection
import { useHistory } from "react-router-dom";
import { IonPage } from "@ionic/react";
import "./signup.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  // State to store the user ID
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user ID
        setUserId(user.uid);
        console.log(`User ID: ${user.uid}`);
        // Navigate to the Tab1 page after successful login/signup
        history.push('/Tab1');
       // window.location.reload();  
      } else {
        // User is signed out  
        setUserId(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [history]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully");
        window.location.reload();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created successfully");
        // Instead of setting the document with the userId as the ID, create a new document
        await addDoc(collection(firestore, "users"), {
          userId: userCredential.user.uid, // Store the userId in a field
          email: email, // Store the email or any other information you find necessary
          
        });
        window.location.reload();
        console.log("User document with userId field created in Firestore");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <IonPage>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form className="cell" onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        /><br></br><br></br>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br></br><br></br>
        <button className="chip" type="submit">{isLogin ? "Login" : "Sign Up"}</button> 
      </form>
      <button className="legally" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </IonPage>
  );
};

export default Login;
