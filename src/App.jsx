import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import PageBuilder from './components/PageBuilder';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<PageBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;