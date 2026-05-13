import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 📱 MOBILE-ONLY ENFORCEMENT
// If the app is accessed via a browser (not the native shell), show a landing page
const isNative = (window as any).isNativeApp || (window as any).ReactNativeWebView;
const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('repl.co');

if (!isNative && !isDev) {
  const rootElement = document.getElementById("root")!;
  rootElement.innerHTML = `
    <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f0fdf4; font-family: system-ui, sans-serif; text-align: center; padding: 20px;">
      <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 400px;">
        <h1 style="color: #166534; font-size: 28px; margin-bottom: 16px;">📱 Kilimo AI Mobile</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Kilimo AI is exclusively available as a mobile application for the best farming experience.
        </p>
        <div style="background: #166534; color: white; padding: 14px 28px; border-radius: 12px; font-weight: 600; cursor: pointer;">
          Pakua App Sasa
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
          Available on Google Play & App Store
        </p>
      </div>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
  