import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, BarChart2, Cpu, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand-logo">
        <HomeIcon size={26} color="#06B6D4" />
        <span>House Price Predictor</span>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Home size={18} />
            Predict Price
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <History size={18} />
            History
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <BarChart2 size={18} />
            Analytics
          </NavLink>
        </li>
        <li>
          <NavLink to="/about-model" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Cpu size={18} />
            About Model
          </NavLink>
        </li>
      </ul>

      <div className="status-badge">
        <div className="status-dot" />
        ML Model Active
      </div>
    </nav>
  );
}
