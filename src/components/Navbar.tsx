import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Menu, X, Github, Mail, Sun, Moon, Palette, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import avatarVideo from '@/src/assets/Animacja_Trim.mp4';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme, palette, setPalette, availablePalettes } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold tracking-tight text-text-main flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-surface flex items-center justify-center">
            <video 
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
              className="w-full h-full object-cover"
              src={avatarVideo}
            />
          </div>
          Saderius
        </Link>

        <div className="hidden md:flex items-center gap-3">
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
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="text-sm font-medium text-text-muted hover:text-text-main hover:scale-110 transition-all duration-300 px-2">
            Resume
          </a>
          <a href="https://github.com/Saderius" target="_blank" rel="noreferrer" className="p-2 rounded-full glass glass-hover text-text-muted hover:text-text-main transition-all duration-300">
            <Github className="w-5 h-5" />
          </a>
          <Link to="/contact" className="px-5 py-2 rounded-full bg-inverted text-inverted-text font-medium hover:opacity-80 transition-colors text-sm">
            Contact Me
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
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
          <button
            className="p-2 text-text-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-t border-surface-border p-4 flex flex-col gap-2">
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main">
            View Resume
          </a>
          <div className="flex items-center gap-4 px-4 py-2">
            <a href="https://github.com/Saderius" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-main">
              <Github className="w-6 h-6" />
            </a>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center px-5 py-2 rounded-full bg-inverted text-inverted-text font-medium hover:opacity-80 transition-colors text-sm">
              Contact Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
