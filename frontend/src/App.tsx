import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/dashboard/DashboardPage';
import ScenePage from './pages/scene/ScenePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/scene/:sceneId" element={<ScenePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
