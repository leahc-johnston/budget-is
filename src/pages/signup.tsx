import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonPage } from "@ionic/react";

import "./signup.css";

const Login: React.FC = () => {
  const [userId, setUserId] = useState(0);  // State to track user ID, starting from 0
  const history = useHistory();

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Prevent the default form submission behavior
    setUserId(currentId => {
      const newId = currentId + 1;  // Increment user ID
      history.push(`/Tab1?userId=${newId}`);  // Navigate to '/Tab1' with new user ID
      return newId;
    });
  };

  return (
    <IonPage>
      <h1>Login or Sign Up</h1>
      <form className="cell" onSubmit={handleAuth}>
        <button className="chip" type="submit">Proceed with New User ID</button>
      </form>
      <button className="legally" onClick={() => {
        setUserId(currentId => {
          const newId = currentId + 1;  // Increment user ID
          history.push(`/Tab1?userId=${newId}`);  // Navigate to '/Tab1' with new user ID
          return newId;
        });
      }}>
        Proceed without Signing In
      </button>
    </IonPage>
  );
};

export default Login;
