import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import DownloadsPage from './pages/DownloadsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import Error404Page from './pages/Error404Page';
import Error500Page from './pages/Error500Page';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col text-gray-300 antialiased overflow-x-hidden selection:bg-[#D97706] selection:text-white grid-bg relative">
          {/* Background Glows */}
          <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-[#5F7057]/5 rounded-full blur-[140px] pointer-events-none z-[-1] animate-[pulse_6s_ease-in-out_infinite]"></div>
          <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D97706]/5 rounded-full blur-[140px] pointer-events-none z-[-1]"></div>

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main id="main-content" className="flex-1 container mx-auto px-[5%] pt-32 pb-20 max-w-[1400px] z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/500" element={<Error500Page />} />
              <Route path="*" element={<Error404Page />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
