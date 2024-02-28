// Assuming this is your main.tsx or index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Make sure this path is correct
import { UserProvider } from './components/context'; // Adjust the import path as necessary

const container = document.getElementById('root');
const root = createRoot(container!); // Using createRoot for React 18+

root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
