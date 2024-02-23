// src/AuthPage.tsx

import React, { useState } from "react";
import { auth, firestore } from "../components/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import Tab1 from './Tab1';
import { IonButton, IonPage } from "@ionic/react";
import './signup.css';


const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created successfully");
      }
      history.push('/Tab1');
      window.location.reload();
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <IonPage>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleAuth} className="cell">
  
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
        {/* <IonButton onClick={() => {handleAuth}}></IonButton> */}
      <button className="chip"type="submit">{isLogin ? "Login" : "Sign Up"}</button> 
      </form>
      <button className="legally" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    
    </IonPage>
  );
};

export default Login;
