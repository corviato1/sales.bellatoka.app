import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesPage from "./pages/SalesPage";
import Admin from "./pages/Admin";
import { initConsoleCapture } from "./utils/consoleCapture";
import "./styles/global.css";

initConsoleCapture();

function App() {
  return (
    <Routes>
      <Route path="/" element={<SalesPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
