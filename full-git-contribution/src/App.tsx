import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GitContributions from './pages/GitContributions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contributions" element={<GitContributions />} />
        <Route path="/contributions/:users" element={<GitContributions />} />
      </Routes>
    </Router>
  );
}

export default App;