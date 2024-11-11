import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="container mx-auto p-4">
      <Router>
        <Navigation />        
      </Router>
    </div>
  );
}

export default App;
