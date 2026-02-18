import React, { useState } from "react";

function LogLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "450") {
      onLogin();
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "40px 30px", maxWidth: 380, width: "100%", textAlign: "center" }}>
        <h2 style={{ color: "#1a472a", marginBottom: 5 }}>Diagnostics</h2>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: 25 }}>Bella Toka System Log</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: "12px 14px", border: "2px solid #e0e0e0", borderRadius: 8, fontSize: "1rem", marginBottom: 15, boxSizing: "border-box" }}
          />
          {error && <p style={{ color: "#dc3545", fontSize: "0.85rem", marginBottom: 10 }}>{error}</p>}
          <button type="submit" style={{ width: "100%", padding: 14, background: "#1a472a", color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
            Access Logs
          </button>
        </form>
      </div>
    </div>
  );
}

function LogDashboard() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const addLog = (entry) => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), ...entry }]);
  };

  const testEndpoint = async (name, url, testPassword) => {
    addLog({ type: "info", msg: `Testing ${name}: POST ${url}` });

    try {
      const optionsRes = await fetch(url, { method: "OPTIONS" });
      addLog({ type: optionsRes.ok || optionsRes.status === 204 ? "ok" : "warn", msg: `${name} OPTIONS: ${optionsRes.status}` });
    } catch (err) {
      addLog({ type: "error", msg: `${name} OPTIONS failed: ${err.message}` });
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: testPassword }),
      });
      const text = await res.text();
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = null; }

      if (res.ok && parsed && parsed.success) {
        addLog({ type: "ok", msg: `${name} auth SUCCESS (${res.status}): token received` });
      } else if (res.status === 401) {
        addLog({ type: "warn", msg: `${name} auth REJECTED (401): ${parsed ? parsed.error : text}` });
        addLog({ type: "info", msg: "401 means the endpoint works but the password didn't match." });
      } else if (res.status === 500) {
        addLog({ type: "error", msg: `${name} SERVER ERROR (500): ${parsed ? parsed.error : text}` });
        addLog({ type: "info", msg: "500 usually means env var is not set or there's a code error in the function." });
      } else {
        addLog({ type: "warn", msg: `${name} response (${res.status}): ${text.substring(0, 300)}` });
      }
    } catch (err) {
      addLog({ type: "error", msg: `${name} POST failed: ${err.message}` });
      addLog({ type: "info", msg: "This usually means the function doesn't exist at this URL or there's a network issue." });
    }

    try {
      const badRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "definitely-wrong-password-xyz-123" }),
      });
      const badText = await badRes.text();
      let badParsed;
      try { badParsed = JSON.parse(badText); } catch { badParsed = null; }

      if (badRes.status === 401) {
        addLog({ type: "ok", msg: `${name} correctly rejects wrong password (401)` });
      } else if (badRes.status === 500) {
        addLog({ type: "error", msg: `${name} CRASHES on wrong password (500): ${badParsed ? badParsed.error : badText}` });
        addLog({ type: "info", msg: "This is likely the timingSafeEqual length mismatch bug." });
      } else {
        addLog({ type: "warn", msg: `${name} wrong password response (${badRes.status}): ${badText.substring(0, 200)}` });
      }
    } catch (err) {
      addLog({ type: "error", msg: `${name} wrong-password test failed: ${err.message}` });
    }
  };

  const runDiagnostics = async () => {
    setLogs([]);
    setRunning(true);

    addLog({ type: "info", msg: "Starting diagnostics..." });
    addLog({ type: "info", msg: `Location: ${window.location.origin}` });
    addLog({ type: "info", msg: `Environment: ${process.env.NODE_ENV}` });

    addLog({ type: "info", msg: "--- Admin Auth ---" });
    await testEndpoint("Admin", "/.netlify/functions/auth", "test-probe");

    addLog({ type: "info", msg: "--- Dashboard Auth ---" });
    await testEndpoint("Dashboard", "/.netlify/functions/dashboard-auth", "test-probe");

    addLog({ type: "info", msg: "Diagnostics complete." });
    setRunning(false);
  };

  const getColor = (type) => {
    if (type === "ok") return "#2d5a3f";
    if (type === "error") return "#dc3545";
    if (type === "warn") return "#e65100";
    return "#666";
  };

  const getPrefix = (type) => {
    if (type === "ok") return "[OK]";
    if (type === "error") return "[ERROR]";
    if (type === "warn") return "[WARN]";
    return "[INFO]";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "monospace", padding: 20 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #30363d", paddingBottom: 15 }}>
          <div>
            <h2 style={{ margin: 0, color: "#58a6ff" }}>Bella Toka — System Diagnostics</h2>
            <p style={{ margin: "5px 0 0", fontSize: "0.85rem", color: "#8b949e" }}>Auth endpoint testing & environment checks</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={runDiagnostics}
              disabled={running}
              style={{ padding: "10px 20px", background: running ? "#30363d" : "#238636", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.9rem", fontWeight: 600, cursor: running ? "not-allowed" : "pointer" }}
            >
              {running ? "Running..." : "Run Diagnostics"}
            </button>
            <a href="/" style={{ padding: "10px 20px", background: "#30363d", color: "#c9d1d9", border: "none", borderRadius: 6, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center" }}>
              Back
            </a>
          </div>
        </div>

        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 20, minHeight: 300 }}>
          {logs.length === 0 && !running && (
            <p style={{ color: "#8b949e", textAlign: "center", marginTop: 60 }}>
              Click "Run Diagnostics" to test auth endpoints and check for errors.
            </p>
          )}
          {logs.map((log, i) => (
            <div key={i} style={{ padding: "4px 0", fontSize: "0.85rem", lineHeight: 1.6 }}>
              <span style={{ color: "#8b949e" }}>{log.time}</span>{" "}
              <span style={{ color: getColor(log.type), fontWeight: 600 }}>{getPrefix(log.type)}</span>{" "}
              <span style={{ color: log.type === "info" ? "#8b949e" : getColor(log.type) }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Log() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <LogLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <LogDashboard />;
}

export default Log;
