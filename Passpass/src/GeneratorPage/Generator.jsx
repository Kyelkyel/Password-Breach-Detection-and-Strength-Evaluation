import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Generator.css";

export default function Generator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(14);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const navigate = useNavigate();

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const num = "0123456789";
  const sym = "!@#$%^&*()_+[]{}<>?/|";

  function generatePassword() {
    let chars = "";
    if (uppercase) chars += upper;
    if (lowercase) chars += lower;
    if (numbers) chars += num;
    if (symbols) chars += sym;
    if (!chars) chars = upper;

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  }

  function copyPassword() {
    navigator.clipboard.writeText(password);
    alert("Password copied!");
  }

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  return (
    <div className="generator-page-wrapper">
      <div className="generator-header-wrapper">
        <header className="generator-header" onClick={() => navigate('/')}>
          passpass
        </header>
        <nav className="generator-nav">
           <button className="generator-nav-button" onClick={() => navigate('/')}>
            Home
          </button>
        </nav>
      </div>

      <div className="generator-container">
        <div className="generator-card">
          <div className="generator-password-box">
            <span>{password}</span>
            <div className="generator-password-actions">
              <button className="generator-btn" onClick={generatePassword}>Regenerate</button>
            </div>
          </div>
          <div className="generator-green-bar"></div>
          <div className="generator-content">
            <h2>Customize your password</h2>

            <div className="generator-range-box">
              <label>Password Length</label>
              <input
                type="number"
                value={length}
                min="8"
                max="32"
                onChange={(e) => setLength(Number(e.target.value))}
              />
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>

            <div className="generator-options">
              <div className="generator-options-right">
                <label>
                  <input
                    type="checkbox"
                    checked={uppercase}
                    onChange={() => setUppercase(!uppercase)}
                  /> Uppercase
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={lowercase}
                    onChange={() => setLowercase(!lowercase)}
                  /> Lowercase
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={numbers}
                    onChange={() => setNumbers(!numbers)}
                  /> Numbers
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={symbols}
                    onChange={() => setSymbols(!symbols)}
                  /> Symbols
                </label>
              </div>
            </div>

            <button className="generator-copy-btn" onClick={copyPassword}>
              Copy password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}