import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import Admin from './Admin';
import ProjectDetail from './components/ProjectDetail';
import Project from './pages/Project';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public View: What everyone sees */}
        <Route path="/" element={<Gallery />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        
        <Route path="/project/:id" element={<Project />} />

        {/* Admin View: Your secret dashboard */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;



