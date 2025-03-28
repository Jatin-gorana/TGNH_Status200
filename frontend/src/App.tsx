import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import DiscoverArtifact from './pages/DiscoverArtifact';
import ARExperience from './pages/ARExperience';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/discover-artifacts" element={<DiscoverArtifact />} />
        <Route path="/ar-experience" element={<ARExperience />} />
      </Routes>
    </>
  );
}

export default App;



