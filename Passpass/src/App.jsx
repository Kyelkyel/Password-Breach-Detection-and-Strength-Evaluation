import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./frontend/LandingPage/LandingPage";
import Generator from "./GeneratorPage/Generator";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generator" element={<Generator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;