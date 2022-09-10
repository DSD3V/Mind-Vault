import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthWrapper } from './auth/AuthWrapper';
import { Home } from './components/Home';
import { Navbar } from './components/Navbar';
import { PageNotFound } from './components/PageNotFound';
import { selectUserIsAuthenticated } from './selectors/userSelectors';
import { useAppSelector } from './store';

export const App = () => {
  const isAuthenticated = useAppSelector(selectUserIsAuthenticated);
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] = useState(false);

  const closeLoginSignupModal = () => setIsLoginSignupModalOpen(false);
  const openLoginSignupModal = () => setIsLoginSignupModalOpen(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginSignupModalOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <AuthWrapper>
        <Navbar openLoginSignupModal={openLoginSignupModal} />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route element={<Home />} path="/" />
              <Route element={<PageNotFound />} path="*" />
            </>
          ) : (
            <Route
              element={
                <Home
                  closeLoginSignupModal={closeLoginSignupModal}
                  isLoginSignupModalOpen={isLoginSignupModalOpen}
                  openLoginSignupModal={openLoginSignupModal}
                />
              }
              path="*"
            />
          )}
        </Routes>
      </AuthWrapper>
    </Router>
  );
};
