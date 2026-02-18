import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesPage from "./pages/SalesPage";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import { initConsoleCapture } from "./utils/consoleCapture";
import "./styles/global.css";

initConsoleCapture();

function App() {
  return (
    <Routes>
      <Route path="/" element={<SalesPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/log" element={<Log />} />
    </Routes>
  );
}

export default App;
