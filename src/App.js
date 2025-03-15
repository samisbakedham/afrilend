import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Loans from './components/Loans';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>AfriLend</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/loans">Browse Loans</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loans" element={<Loans />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;