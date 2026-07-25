import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Background } from './components/Background';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Contact } from './pages/Contact';
import { ThemeProvider } from './components/ThemeProvider';
import { ResumeModal } from './components/ResumeModal';
import { SeoHead } from './components/SeoHead';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="saderius-theme">
        <Router>
          <SeoHead />
          <Background />
          <ResumeModal />
          <div className="min-h-screen flex flex-col relative z-10">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <footer className="py-12 border-t border-surface-border mt-auto">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-center text-text-muted text-sm">
                    © {new Date().getFullYear()} Saderius. All rights reserved.
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <a 
                      href="https://ko-fi.com/saderius" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-text-muted hover:text-primary transition-colors duration-300"
                      title="Ko-fi"
                    >
                      <span className="sr-only">Ko-fi</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.57s1.905.127 2.003 2.6c.05.125.04.148-.009.28-.27.817-1.124 1.34-1.882 1.465z"/>
                      </svg>
                    </a>
                    
                    <a 
                      href="https://x.com/saderiusishere" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-text-muted hover:text-text-main transition-colors duration-300"
                      title="X (Twitter)"
                    >
                      <span className="sr-only">X (Twitter)</span>
                      <svg width="22" height="22" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>
                      </svg>
                    </a>
                    
                    <a 
                      href="https://discord.gg/cgS6WhQAXC" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-text-muted hover:text-[#5865F2] transition-colors duration-300"
                      title="Discord"
                    >
                      <span className="sr-only">Discord</span>
                      <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.15ZM42.56,65.36c-5.36,0-9.8-4.83-9.8-10.74s4.36-10.74,9.8-10.74c5.46,0,9.89,4.84,9.8,10.74C52.36,60.53,48,65.36,42.56,65.36Zm42,0c-5.36,0-9.8-4.83-9.8-10.74s4.36-10.74,9.8-10.74c5.46,0,9.89,4.84,9.8,10.74C84.56,60.53,80.12,65.36,84.56,65.36Z"/>
                      </svg>
                    </a>
                    
                    <a 
                      href="https://play.google.com/store/apps/dev?id=5959135109587161735" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-text-muted hover:text-[#32A071] transition-colors duration-300"
                      title="Google Play"
                    >
                      <span className="sr-only">Google Play</span>
                      <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.6427 4.90483C11.1578 5.41913 10.865 6.18206 10.865 7.15174V40.8504C10.865 41.8157 11.1555 42.5761 11.6368 43.0904L11.758 43.197L31.9566 22.9961V22.6568V22.3151L11.765 2.11426L11.6427 4.90483Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M38.6472 29.6826L31.9564 23.003L31.9564 22.6637L31.9564 22.3245L38.6496 15.6313C38.6496 15.6313 38.6836 15.663 38.7107 15.679L46.3312 20.0076C48.5562 21.271 48.5562 23.3364 46.3312 24.6022L38.7107 28.9308C38.6836 28.9466 38.6472 29.6826 38.6472 29.6826Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M38.7118 28.9304L31.9575 22.176L11.6438 42.4897C12.4419 43.3218 13.7845 43.4393 15.3533 42.5484L38.7118 28.9304Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M38.7118 15.6794L15.3533 2.06141C13.7845 1.17042 12.4419 1.288 11.6438 2.12015L31.9575 22.4338L38.7118 15.6794Z" fill="currentColor"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}
