import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Keep browser offline support for existing POS orders without install prompts.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
      .catch((registrationError) => {
        console.error('SW registration failed:', registrationError);
      });
  });
}

// A worker left over from an earlier deployment can otherwise mask Vite updates.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration('/').then((registration) => {
    if (registration?.active?.scriptURL === `${window.location.origin}/sw.js`) return registration.unregister();
  }).catch(() => {});
}
