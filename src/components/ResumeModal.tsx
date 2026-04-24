import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function ResumeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsLoading(true);
    };
    window.addEventListener('open-resume', handleOpen);
    return () => window.removeEventListener('open-resume', handleOpen);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl h-full max-h-[90vh] lg:max-h-[85vh] glass rounded-3xl border border-primary/20 shadow-2xl flex flex-col overflow-hidden bg-background/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-border bg-surface-hover/80 backdrop-blur-md z-10 shrink-0">
              <h2 className="text-lg sm:text-xl font-display font-bold text-text-main flex items-center gap-3">
                Interactive Resume
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <a href="https://saderius.github.io/CV-interactive/" target="_blank" rel="noreferrer" title="Open in new tab">
                   <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                     <ExternalLink className="w-4 h-4" />
                     <span>Open full screen</span>
                   </Button>
                   <Button variant="outline" size="sm" className="flex sm:hidden p-2">
                     <ExternalLink className="w-4 h-4" />
                   </Button>
                </a>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full glass glass-hover text-text-muted hover:text-text-main transition-all duration-300 bg-surface/50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Iframe Container */}
            <div className="flex-1 w-full bg-background relative z-0">
               {isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary bg-background/80 backdrop-blur-sm z-10">
                   <Loader2 className="w-8 h-8 animate-spin" />
                   <p className="font-medium animate-pulse">Loading interactive experience...</p>
                 </div>
               )}
               <iframe 
                 src="https://saderius.github.io/CV-interactive/"
                 className="absolute inset-0 w-full h-full border-0 rounded-b-3xl"
                 title="Saderius Interactive Resume"
                 onLoad={() => setIsLoading(false)}
               />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
