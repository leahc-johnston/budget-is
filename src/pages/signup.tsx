import React, { useState, useEffect } from "react";
import { auth } from "../components/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { Redirect } from "react-router-dom"; // Import Redirect
import { IonPage } from "@ionic/react";
import { FirebaseError } from "firebase/app";

import "./signup.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage redirect

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Set state instead of pushing to history
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again."; // Default error message
    
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid Credentials.";
            break;
          case "auth/weak-password":
            errorMessage = "The password is too weak.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "The email is already in use by another account.";
            break;
          case "auth/wrong-password":
            errorMessage = "Invalid Credentials.";
            break;
          case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
          default:
            errorMessage = error.message; // Use the Firebase error message as a fallback
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      setError(errorMessage);
      setEmail("");
      setPassword("");
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/Tab1" />;
  }

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
        /><br/><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        /><br/><br/>
        <button className="chip" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <button className="legally" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </IonPage>
  );
};

export default Login;
