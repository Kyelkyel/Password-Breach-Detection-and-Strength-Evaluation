import React, { useState, useMemo } from "react";
import "./LandingPage.css";

function LandingPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const tips = [
    "Use a unique password for each account.",
    "Never share your passwords with anyone.",
    "Enable two-factor authentication when possible.",
    "Avoid using personal info like birthdays in passwords.",
    "Use a password manager to keep track of your passwords.",
    "Change your important passwords regularly.",
    "Don’t reuse old passwords for new accounts."
  ];
  
  const todayTip = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }, []);

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

  // Character requirement checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <>
      {/* Landing Page Section */}
      <div className="landing-container">
        <header className="header">
          <h1 className="logo">passpass</h1>
          <nav>
            <ul className="nav-links">
              <li>
                <button className="nav-btn">Generator</button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="main-section">
          
          <div className="text-box">
            <h2>
              How Secure is your Password?
            </h2>
            <div className="input-check">
              <input
                type="text"
                placeholder="Type a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="check-btn"
                onClick={handleCheck}
                disabled={loading}
              >
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
                    This password was found in known breaches!
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

            {/* Tip */}
            <div className="tip-box">
              <h3>Tip</h3>
              <p>{todayTip}</p>
            </div>
          </div>
          <div className="image-box">
            <img src="\src\assets\lock.png" alt="lock icon" />
          </div>

          
        </main>
      </div>

      {/* Features Section */}
      <section className="feature-section">
        <div className="feature-card">
          
          <h3>Password Generator</h3>
          <p>
            Pellentesque quis tincidunt sit amet. Tortor massa sed habitant dignissim senectus purus.
            Consectetur integer id in et pulvinar interdum id.
          </p>
          <button className="feature-btn">Password Generator →</button>
        </div>

        <div className="feature-card">
          
          <h3>Learn More</h3>
          <p>
            Quam sed neque vitae viverra purus venenatis ac non. Eget sed nunc, amet nibh nulla.
            Morbi sed risus ullamcorper diam, elit ut non.
          </p>
          <button
            className="feature-btn"
            onClick={() => {
              const faqSection = document.querySelector(".faq-section");
              if (faqSection) {
                faqSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Learn More →
          </button>

        </div>

        <div className="feature-card">
          
          <h3>Stay Safe</h3>
          <p>
            Euismod sed pellentesque ut elementum. Accumsan gravida turpis ac at.
            Ullamcorper vitae non est elit odio at augue consequat.
          </p>
          <button
            className="feature-btn"
            onClick={() => {
              const tipsSection = document.querySelector(".tips-section");
              if (tipsSection) {
                tipsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            More Tips →
          </button>

        </div>
      </section>

      {/* Info Sections */}
      <section className="info-section dark-bg">
        <div className="info-text">
          <h4>Is it safe to use password checkers?</h4>
          <p>
            Id urna, nisl, ut quam. Diam suspendisse fringilla quam arcu mattis est velit in.
            Nibh in purus sit convallis phasellus ut. Neque suspendisse a habitasse commodo.
          </p>
        </div>
        <div className="info-image">
          <img src="\src\assets\password.png" alt="importance" />
        </div>
      </section>

      <section className="info-section dark-bg">
        <div className="info-image">
          <img src="\src\assets\password.png" alt="importance" />
        </div>
        <div className="info-text">
          <h4>How is Passpass safe?</h4>
          <p>
            Id urna, nisl, ut quam. Diam suspendisse fringilla quam arcu mattis est velit in.
            Nibh in purus sit convallis phasellus ut. Neque suspendisse a habitasse commodo.
          </p>
        </div>
      </section>
 
      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <details className="faq-card">
            <summary>
              <span>Why use passwords?</span>
            </summary>
            <div className="faq-content">
              <p>
                Passwords act as the first layer of protection for your online accounts and data,
                preventing unauthorized access.
              </p>
            </div>
          </details>

          <details className="faq-card">
            <summary>
              <span>Why are passwords important?</span>
            </summary>
            <div className="faq-content">
              <p>
                Strong passwords safeguard sensitive information such as personal details,
                financial records, and private communications.
              </p>
            </div>
          </details>

          <details className="faq-card">
            <summary>
              <span>Why does password strength matter?</span>
            </summary>
            <div className="faq-content">
              <p>
                A strong password reduces the risk of brute force attacks and data breaches,
                making it harder for hackers to gain access.
              </p>
            </div>
          </details>

          <details className="faq-card">
            <summary>
              <span>Is my password stored?</span>
            </summary>
            <div className="faq-content">
              <p>
                No, Passpass never stores or logs your password. All checks are done securely.
              </p>
            </div>
          </details>

          <details className="faq-card">
            <summary>
              <span>How accurate is the strength check?</span>
            </summary>
            <div className="faq-content">
              <p>
                The strength score is calculated based on multiple factors such as length,
                complexity, and known breaches.
              </p>
            </div>
          </details>

          <details className="faq-card">
          <summary>
            <span>What should I do if my password is weak?</span>
          </summary>
          <div className="faq-content">
            <p>
              You should create a stronger one with a mix of letters, numbers, and symbols,
              or use the Password Generator provided.
            </p>
            <button
              className="faq-btn"
              onClick={() => {
                const generatorSection = document.querySelector(".feature-section");
                if (generatorSection) {
                  generatorSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Need Help? Generate Here
            </button>
          </div>
        </details>
        </div>
      </section>

      <section className="tips-section">
        <h2>Stay Safe Online</h2>
        <div className="tips-grid">
          <div className="tip-card">Use strong and unique passwords for each account.</div>
          <div className="tip-card">Enable two-factor authentication whenever possible.</div>
          <div className="tip-card">Avoid using personal information like birthdays in passwords.</div>
          <div className="tip-card">Use a password manager to store and generate secure passwords.</div>
          <div className="tip-card">Be cautious of phishing emails and suspicious links.</div>
          <div className="tip-card">Keep your software and browsers up to date.</div>
        </div>
      </section>

    </>
    
  );
}

export default LandingPage;
