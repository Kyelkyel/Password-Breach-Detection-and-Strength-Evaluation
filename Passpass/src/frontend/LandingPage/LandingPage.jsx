import React, { useState } from "react";
import "./LandingPage.css";
 
 
function LandingPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleCheck = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
 
      if (!response.ok) {
        throw new Error("Failed to connect to backend");
      }
 
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({
        strength_score: 0,
        strength_category: "Error",
        is_breached: false,
        suggestions: ["Backend not reachable"],
      });
    } finally {
      setLoading(false);
    }
  };
 
  // Helpers for progress bar
  const getProgressWidth = (score) => {
    return `${(score / 5) * 100}%`;
  };
 
  const getFillClass = (category) => {
    return "fill-" + category.toLowerCase().replace(" ", "-");
  };
 
  // ✅ Character requirement checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
 
  return (
    <div className="landing-container">
      <header className="header">
        <h1 className="logo">passpass</h1>
        <nav>
          <ul className="nav-links">
            <li>Text</li>
            <li>Text</li>
            <li>Text</li>
            <li>Text</li>
            <li>
              <button className="nav-btn">Text</button>
            </li>
          </ul>
        </nav>
      </header>
 
      <main className="main-section">
        <div className="text-box">
          <h2>
            How Secure is your <br /> Password?
          </h2>
          <div className="input-check">
            <input
              type="text"
              placeholder="Type a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="check-btn" onClick={handleCheck} disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </button>
          </div>
 
          {result && (
            <div className="result-box">
              <h3
                className={
                  "strength-" +
                  result.strength_category.toLowerCase().replace(" ", "-")
                }
              >
                Strength: {result.strength_category}
              </h3>
 
              {/* Progress bar */}
              <div className="progress-bar">
                <div
                  className={`progress-fill ${getFillClass(
                    result.strength_category
                  )}`}
                  style={{ width: getProgressWidth(result.strength_score) }}
                ></div>
              </div>
 
              {result.is_breached && (
                <p className="breach-warning">
                  ⚠️ This password was found in known breaches!
                </p>
              )}
 
              <ul>
                {result.suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
 
          <p className="character-text">
            Characters containing:
            <span className={hasLower ? "met" : ""}>Lower Case</span>
            <span className={hasUpper ? "met" : ""}>Upper Case</span>
            <span className={hasNumber ? "met" : ""}>Numbers</span>
            <span className={hasSymbol ? "met" : ""}>Symbols</span>
          </p>
        </div>
        <div className="image-box">
          <img src="\src\assets\lock.png" alt="lock icon" />
        </div>
      </main>
    </div>
  );
}
 
export default LandingPage;