import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DiscoverArtifacts from './pages/DiscoverArtifacts';
import ARExperience from './pages/ARExperience';
import ClimateImpact from './pages/ClimateImpact';
import Restoration from './pages/Restoration';
import CulturalMapping from './pages/CulturalMapping';
import Community from './pages/Community';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover-artifacts" element={<DiscoverArtifacts />} />
        <Route path="/ar-experience" element={<ARExperience />} />
        <Route path="/climate-impact" element={<ClimateImpact />} />
        <Route path="/restoration" element={<Restoration />} />
        <Route path="/cultural-mapping" element={<CulturalMapping />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </>
  );
}

export default App;