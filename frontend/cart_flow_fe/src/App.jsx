import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

/**
 * Root Application Entry
 * Kept ultra-clean with Theme and Router Providers.
 */
function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
