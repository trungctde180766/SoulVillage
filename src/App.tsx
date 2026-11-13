import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ExplorePage } from './features/explore/ExplorePage';
import { PlaceDetailPage } from './features/places/PlaceDetailPage';
import { JourneyPage } from './features/journey/JourneyPage';
import { PassportPage } from './features/passport/PassportPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/place/:placeId" element={<PlaceDetailPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
