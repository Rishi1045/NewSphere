import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import Login from './pages/Login';
import Layout from './components/Layout';
import GlobeLoader from './components/GlobeLoader';


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const [showIntro, setShowIntro] = React.useState(true);

  React.useEffect(() => {
    // Check if we've shown the intro in this session
    const hasShown = sessionStorage.getItem('newsphere_intro_shown');
    if (hasShown) {
      setShowIntro(false);
    } else {
      // Mark as shown for next time
      sessionStorage.setItem('newsphere_intro_shown', 'true');
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AnimatePresence>
          {showIntro && <GlobeLoader onComplete={() => setShowIntro(false)} />}
        </AnimatePresence>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
