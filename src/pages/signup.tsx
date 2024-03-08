import React, { useState, useEffect } from "react";
import { auth } from "../components/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useHistory } from "react-router-dom";
import { IonPage } from "@ionic/react";
import "./signup.css";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        history.push('/Tab1');
      }
    });

    return () => unsubscribe();
  }, [history]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.reload();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.reload();
      }
    } catch (error) {
      // Catch and set the error message
      setError("Invalid credentials");
      // Clear the input fields
      setEmail("");
      setPassword("");
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
