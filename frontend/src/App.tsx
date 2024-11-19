import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigation />} />
      </Routes>
    </Router>
  );
}

export default App;