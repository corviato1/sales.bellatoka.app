import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SalesPage from "./pages/SalesPage";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import Contact from "./pages/Contact";
import { initConsoleCapture } from "./utils/consoleCapture";
import "./styles/global.css";

initConsoleCapture();

function App() {
  useEffect(() => {
    const cursorUrl = `${process.env.PUBLIC_URL}/images/cursor.png`;

    const style = document.createElement("style");
    style.textContent = `
      * { cursor: url('${cursorUrl}') 4 1, auto; }
      @keyframes click-ripple {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(1); opacity: 0; }
      }
      .cursor-ripple {
        position: fixed;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid rgba(45, 90, 63, 0.6);
        pointer-events: none;
        z-index: 9999;
        animation: click-ripple 0.4s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    const handleClick = (e) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX - 15}px`;
      ripple.style.top = `${e.clientY - 15}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SalesPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/log" element={<Log />} />
    </Routes>
  );
}

export default App;
