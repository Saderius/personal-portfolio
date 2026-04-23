import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { X, Github, Mail, Sun, Moon, Palette, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isHeroButtonsVisible, setIsHeroButtonsVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme, palette, setPalette, availablePalettes } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let nameObserver: IntersectionObserver;
    let buttonsObserver: IntersectionObserver;
    
    const checkAndObserve = () => {
      const nameTarget = document.getElementById('hero-name');
      if (nameTarget) {
        nameObserver = new IntersectionObserver(
          ([entry]) => {
            setIsHeroVisible(entry.isIntersecting);
            if (entry.isIntersecting) {
              setIsSheetOpen(false); // Auto-close sheet when scrolling back to top
            }
          },
          { threshold: 0 }
        );
        nameObserver.observe(nameTarget);
      } else {
        setIsHeroVisible(false);
      }

      const buttonsTarget = document.getElementById('hero-action-buttons');
      if (buttonsTarget) {
        buttonsObserver = new IntersectionObserver(
          ([entry]) => {
            setIsHeroButtonsVisible(entry.isIntersecting);
          },
          { threshold: 0 }
        );
        buttonsObserver.observe(buttonsTarget);
      } else {
        setIsHeroButtonsVisible(false);
      }
    };
    
    const timeout = setTimeout(checkAndObserve, 100);
    return () => {
      clearTimeout(timeout);
      if (nameObserver) nameObserver.disconnect();
      if (buttonsObserver) buttonsObserver.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [location.pathname]);

  const cycleTheme = () => {
    const themes: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme as any);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const cyclePalette = () => {
    const currentIndex = availablePalettes.findIndex(p => p.id === palette.id);
    const nextIndex = (currentIndex + 1) % availablePalettes.length;
    setPalette(availablePalettes[nextIndex]);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
          isScrolled ? 'glass py-3' : 'bg-transparent py-5'
        )}
      >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex-1 flex items-center h-8">
          <AnimatePresence>
            {!isHeroVisible && !isSheetOpen && (
              <motion.button
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => setIsSheetOpen((prev) => !prev)}
                className="text-lg md:text-xl font-display font-bold tracking-tight text-text-main flex items-center gap-2 hover:opacity-80 transition-opacity max-w-[65vw] md:max-w-none"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-surface flex items-center justify-center shrink-0 z-10">
                  <img 
                    src="https://i.imgur.com/JyGRmNR.gif"
                    alt="Avatar"
                    className="absolute inset-0 w-full h-full object-cover z-20"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="truncate">Patryk <span className="text-gradient">(Saderius)</span> Mroziński</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center gap-3 justify-end flex-none">
          <AnimatePresence>
            {!isHeroButtonsVisible && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3"
              >
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="text-sm font-medium text-text-muted hover:text-text-main hover:scale-110 transition-all duration-300 px-2">
                  Resume
                </a>
                <a href="https://github.com/Saderius" target="_blank" rel="noreferrer" className="p-2 rounded-full glass glass-hover text-text-muted hover:text-text-main transition-all duration-300">
                  <Github className="w-5 h-5" />
                </a>
                <Link to="/contact" className="px-5 py-2 rounded-full bg-inverted text-inverted-text font-medium hover:opacity-80 transition-colors text-sm">
                  Contact Me
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={cyclePalette}
            className="p-2 rounded-full glass glass-hover text-text-muted hover:text-text-main transition-all duration-300"
            aria-label="Toggle palette"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full glass glass-hover text-text-muted hover:text-text-main transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : theme === 'light' ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={cyclePalette}
            className="p-2 text-text-muted hover:text-text-main"
            aria-label="Toggle palette"
          >
            <Palette className="w-5 h-5" />
          </button>
          <button
            onClick={cycleTheme}
            className="p-2 text-text-muted hover:text-text-main"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : theme === 'light' ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>
        </div>
      </div>
      </header>

      {/* Smart Card Overlay */}
      <AnimatePresence>
        {isSheetOpen && !isHeroVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20, y: -20, transformOrigin: 'top left' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20, y: -20, transformOrigin: 'top left' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-[20px] md:top-[28px] left-4 md:left-6 w-[calc(100vw-32px)] sm:w-[400px] max-h-[calc(100vh-40px)] bg-background/95 backdrop-blur-2xl border border-primary/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-[100] p-6 overflow-y-auto flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-display font-bold text-text-main">About Me</span>
              <button onClick={() => setIsSheetOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-text-muted hover:text-text-main" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10 bg-surface block z-10 mb-4">
                <img 
                  src="https://i.imgur.com/JyGRmNR.gif"
                  alt="Avatar Profile"
                  className="absolute inset-0 w-full h-full object-cover z-20"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-primary mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new opportunities
              </div>

              <h1 className="text-2xl font-display font-bold tracking-tight mb-1 text-text-main">
                Patryk <span className="text-gradient">(Saderius)</span> Mroziński
              </h1>
              
              <h2 className="text-xl font-display font-bold tracking-tight mb-4 text-text-main">
                The <span className="text-gradient">Swiss Army Man</span>
              </h2>

              <p className="text-sm text-text-muted leading-relaxed">
                A versatile QA Lead, Designer, and Developer bridging the gap between creative vision and technical execution. I craft flawless interactive experiences and games, driving top-tier quality in hit titles like House Flipper and Agony.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
