/* import React, { useState } from 'react';
import { auth } from './firebase';

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  return <>{children}</>;
};

export default AuthProvider; */