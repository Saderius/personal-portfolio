import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Background } from './components/Background';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Contact } from './pages/Contact';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="saderius-theme">
      <Router>
        <Background />
        <div className="min-h-screen flex flex-col relative z-10">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <footer className="py-8 text-center text-text-muted text-sm border-t border-surface-border mt-auto">
            <p>© {new Date().getFullYear()} Saderius. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}
