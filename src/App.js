import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RewardManagerPage from './pages/RewardManagerPage'; // ✅ Import this

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/rewards" element={<RewardManagerPage />} /> {/* ✅ Add this */}
            </Routes>
        </Router>
    );
}

export default App;
