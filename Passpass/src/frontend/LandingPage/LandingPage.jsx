import React from "react";
import "./LandingPage.css";

function LandingPage() {
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
            <li><button className="nav-btn">Text</button></li>
          </ul>
        </nav>
      </header>

     
      <main className="main-section">
        <div className="text-box">
          <h2>How Secure is your <br /> Password?</h2>
          <div className="input-check">
            <input type="text" placeholder="Type a password" />
            <button className="check-btn">Check</button>
          </div>
          <p className="character-text">
            Characters containing: 
            <span> Lower Case</span>
            <span> Upper Case</span>
            <span> Numbers</span>
            <span> Symbols</span>
          </p>
        </div>
        <div className="image-box">
          <img src="/assets/lock.png" alt="lock icon" />
        </div>
      </main>
  
      {/* 
      <footer className="footer">
        <ul>
          <li>Password Generator</li>
          <li>Tip of the Day</li>
          <li>More</li>
        </ul>
       </footer>
   
   
      */}

    </div>
    
    ); 
}

export default LandingPage;
