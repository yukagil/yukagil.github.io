import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Services from './Services';
import Contact from './Contact';
import TransformationService from './pages/TransformationService';
import LeadershipService from './pages/LeadershipService';
import DiscoveryService from './pages/DiscoveryService';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Routes>
      <Route path="/" element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      <Route path="/services" element={<Services isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      <Route path="/contact" element={<Contact isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      <Route path="/services/transformation" element={<TransformationService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      <Route path="/services/leadership" element={<LeadershipService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      <Route path="/services/discovery" element={<DiscoveryService isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
    </Routes>
  );
}
