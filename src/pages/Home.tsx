import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Gamepad2, PenTool, Terminal, ExternalLink, Github, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projects, categories } from '@/src/data/projects';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { cn } from '@/src/lib/utils';
import { AlienGame } from '@/src/components/AlienGame';

const categoryIcons: Record<string, React.ReactNode> = {
  games: <Gamepad2 className="w-6 h-6" />,
  apps: <Code className="w-6 h-6" />,
  design: <PenTool className="w-6 h-6" />,
  python: <Terminal className="w-6 h-6" />
};

export function Home() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('featured');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(9);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showRestricted, setShowRestricted] = useState(() => localStorage.getItem('saderius-restricted') === 'true');
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId.toLowerCase()) {
      case 'games': return 'text-category-primary';
      case 'apps': return 'text-category-secondary';
      default: return 'text-text-main';
    }
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setVisibleCount(9);
  };

  const navLinks = [
    { id: 'featured', name: 'Featured' },
    { id: 'games', name: 'Games' },
    { id: 'apps', name: 'Apps' },
    { id: 'python', name: 'Python' },
  ];

  let filteredProjects = activeCategory === 'featured' 
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.category === activeCategory);

  if (!showRestricted) {
    filteredProjects = filteredProjects.filter(p => !p.restricted);
  }

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    // Prioritize active projects
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;

    // Then sort by date
    if (!a.date) return sortOrder === 'newest' ? 1 : -1;
    if (!b.date) return sortOrder === 'newest' ? -1 : 1;
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const visibleProjects = sortedProjects.slice(0, visibleCount);

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section id="hero-section" className="container mx-auto px-4 md:px-6 mb-16 relative min-h-[350px]">
        <div className={cn(
          "max-w-4xl mx-auto text-center transition-all duration-500",
          isGameActive ? "opacity-0 scale-95 pointer-events-none absolute inset-x-0" : "opacity-100 scale-100"
        )}>
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10 bg-surface block z-10">
              <img 
                src="https://i.imgur.com/JyGRmNR.gif"
                alt="Avatar Profile"
                className="absolute inset-0 w-full h-full object-cover z-20"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-primary mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for new opportunities
          </motion.div>
          
          <motion.h1 
            id="hero-name"
            className="text-3xl sm:text-4xl md:text-6xl font-display font-bold tracking-tight mb-3 md:mb-2 text-text-main leading-snug md:leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10,
              mass: 1,
              delay: 0.2
            }}
          >
            Patryk <span className="text-gradient">(Saderius)</span> Mroziński
          </motion.h1>

          <motion.h2 
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 md:mb-8 text-text-main leading-tight md:leading-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The <span className="text-gradient">Swiss Army Man</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A versatile QA Lead, Designer, and Developer bridging the gap between creative vision and technical execution. I craft flawless interactive experiences and games, driving top-tier quality in hit titles like House Flipper and Car Mechanic Simulator.
          </motion.p>
          
          <motion.div 
            id="hero-action-buttons"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/contact')}>
              Get in touch
            </Button>
            <Button 
              as="a"
              href="https://ko-fi.com/saderius"
              target="_blank"
              rel="noreferrer"
              size="lg" 
              className="w-full sm:w-auto gap-2 bg-[#FF5E5B] hover:bg-[#FF5E5B]/90 text-white border-0 shadow-lg shadow-[#FF5E5B]/20 transition-all hover:-translate-y-1 font-bold"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.57s1.905.127 2.003 2.6c.05.125.04.148-.009.28-.27.817-1.124 1.34-1.882 1.465z"/>
              </svg>
              Support me on Ko-fi
            </Button>
            <Button 
              as="a"
              href="https://github.com/Saderius" 
              target="_blank" 
              rel="noreferrer"
              variant="glass" 
              size="lg" 
              className="w-full sm:w-auto gap-2"
            >
              <ArrowRight className="w-4 h-4" /> GitHub
            </Button>
          </motion.div>
        </div>
        
        <AlienGame 
          onGameStart={() => setIsGameActive(true)} 
          onGameEnd={() => setIsGameActive(false)} 
        />
      </section>

      {/* Featured Work Section with Content Picker */}
      <section className="container mx-auto px-4 md:px-6 mb-32">
        <div className="flex flex-col items-center justify-center mb-10 gap-6">
          <h2 className="text-3xl font-display font-bold text-center text-text-main">Featured Work</h2>
          
          {/* Content Picker Nav */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <nav id="category-nav" className="flex items-center gap-1 glass glass-hover rounded-full px-2 py-1 overflow-x-auto no-scrollbar max-w-full">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleCategoryChange(link.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap',
                    activeCategory === link.id
                      ? cn('bg-nav-active', getCategoryColor(link.id))
                      : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                  )}
                >
                  {link.name}
                </button>
              ))}
            </nav>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="px-4 py-2 rounded-full glass glass-hover text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap"
            >
              Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-full glass glass-hover text-sm font-medium text-text-muted hover:text-text-main cursor-pointer transition-colors whitespace-nowrap">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-surface-border text-primary focus:ring-primary bg-surface/50"
                checked={showRestricted}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsAgeModalOpen(true);
                  } else {
                    setShowRestricted(false);
                    localStorage.setItem('saderius-restricted', 'false');
                  }
                }}
              />
              Show all content
            </label>
          </div>
        </div>
        
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${sortOrder}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {sortedProjects.length > 0 ? (
                <div className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProjects.map((project) => {
                      return (
                      <Card 
                        key={project.id} 
                        className="h-full flex flex-col group/card border-surface-border hover:border-primary/50 relative overflow-hidden"
                      >
                        <div className="flex flex-col h-full overflow-hidden rounded-3xl transition-all duration-300">
                          {project.imageUrl && (
                            <div className="relative h-48 overflow-hidden shrink-0">
                              <div className="absolute inset-x-0 -bottom-px h-16 bg-gradient-to-t from-background to-transparent z-10" />
                              <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                              />
                              {project.restricted && (
                                <div className="absolute top-4 right-4 z-20 glass px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 text-red-400 border border-red-500/30 bg-background/60 backdrop-blur-md">
                                  <ShieldAlert className="w-3 h-3" />
                                  Restricted
                                </div>
                              )}
                            </div>
                          )}
                          <CardContent className="flex flex-col flex-1 p-6 pt-6 relative z-20">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-bold uppercase tracking-wider", getCategoryColor(project.category))}>
                                  {project.category}
                                </span>
                                {project.status === 'active' && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                                    Active
                                  </span>
                                )}
                              </div>
                              {project.date && (
                                <span className="text-xs text-text-muted">
                                  {new Date(project.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2 text-text-main">
                              {project.title}
                            </h3>
                            <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-3">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-glass-icon text-text-muted border border-surface-border">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-auto">
                              {project.link && (
                                <Button 
                                  as="a"
                                  href={project.link} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  variant="glass" 
                                  className="flex-1 gap-2"
                                >
                                  View Project <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                              {project.github && (
                                <Button 
                                  as="a"
                                  href={project.github} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  variant="glass" 
                                  size="icon"
                                >
                                  <Github className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )})}
                  </div>
                  {sortedProjects.length > visibleCount && (
                    <div className="mt-10 flex justify-center">
                      <Button 
                        onClick={() => setVisibleCount(prev => prev + 9)} 
                        variant="glass" 
                        className="px-8"
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 glass rounded-3xl text-text-muted">
                  <p>No projects found in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Expertise & AEO Section */}
      <section id="expertise-aeo" className="container mx-auto px-4 md:px-6 mb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-12 mb-10 text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-text-main leading-tight">
                Crafting <span className="text-gradient">Immersive</span> Worlds & Interfaces
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                Blending technical execution with user-centric design across Game Development, Web, and Wear OS native applications.
              </p>
            </div>
            
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="aspect-square glass glass-hover rounded-3xl p-8 flex flex-col justify-end border border-surface-border relative group">
                <div className="absolute top-8 left-8 text-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Gamepad2 size={120} />
                </div>
                <div className="relative z-10 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block text-left">Gamedev</span>
                  <h4 className="text-xl font-bold text-text-main mb-2">Game Design</h4>
                  <p className="text-sm text-text-muted">
                    Immersive UI for top-tier survival and horror games. End-to-end design pipelines.
                  </p>
                </div>
              </div>
              
              <div className="aspect-square glass glass-hover rounded-3xl p-8 flex flex-col justify-end border border-surface-border relative group">
                <div className="absolute top-8 left-8 text-category-secondary/20 group-hover:scale-110 transition-transform duration-500">
                  <Terminal size={120} />
                </div>
                <div className="relative z-10 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-category-secondary mb-2 block text-left">Android</span>
                  <h4 className="text-xl font-bold text-text-main mb-2">Wear OS</h4>
                  <p className="text-sm text-text-muted">Wrist-first Android apps like Scribble & WearSweeper via Jetpack Compose.</p>
                </div>
              </div>

              <div className="aspect-square glass glass-hover rounded-3xl p-8 flex flex-col justify-end border border-surface-border relative group">
                <div className="absolute top-8 left-8 text-text-muted/20 group-hover:scale-110 transition-transform duration-500">
                  <PenTool size={120} />
                </div>
                <div className="relative z-10 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block text-left">Frontend</span>
                  <h4 className="text-xl font-bold text-text-main mb-2">Web & UI/UX</h4>
                  <p className="text-sm text-text-muted">Accessible, polished web interfaces built with React & modern CSS.</p>
                </div>
              </div>

              <div className="aspect-square glass glass-hover rounded-3xl p-8 flex flex-col justify-end border border-surface-border relative group">
                <div className="absolute top-8 left-8 text-category-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Code size={120} />
                </div>
                <div className="relative z-10 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-category-primary mb-2 block text-left">Leadership</span>
                  <h4 className="text-xl font-bold text-text-main mb-2">QA Test Lead</h4>
                  <p className="text-sm text-text-muted">
                    Scaled QC pipelines for heavyweight titles using Python.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ for AEO */}
      <section id="faq-section" className="container mx-auto px-4 md:px-6 mb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="glass glass-hover rounded-2xl border border-surface-border group transition-all duration-300">
              <summary className="p-6 font-bold text-text-main cursor-pointer list-none flex justify-between items-center outline-none rounded-2xl">
                What games has Patryk Mroziński worked on?
                <span className="text-text-muted opacity-50 transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="px-6 pb-6 text-sm text-text-muted text-left">
                Patryk designed intuitive UI for <strong>major survival and strategy titles</strong>. Previously, he served as a QA Test Lead and tested over 60 titles including <strong>House Flipper</strong> and <strong>Car Mechanic Simulator</strong>.
              </p>
            </details>
            <details className="glass glass-hover rounded-2xl border border-surface-border group transition-all duration-300">
              <summary className="p-6 font-bold text-text-main cursor-pointer list-none flex justify-between items-center outline-none rounded-2xl">
                What does Saderius do in Wear OS and Android Development?
                <span className="text-text-muted opacity-50 transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="px-6 pb-6 text-sm text-text-muted text-left">
                Saderius creates polished, touch-optimized applications. Key projects include <strong>Scribble</strong>, a visual sticky note app built with Jetpack Compose, and <strong>WearSweeper</strong>, a touch-optimized Minesweeper reimagined for watch faces.
              </p>
            </details>
            <details className="glass glass-hover rounded-2xl border border-surface-border group transition-all duration-300">
              <summary className="p-6 font-bold text-text-main cursor-pointer list-none flex justify-between items-center outline-none rounded-2xl">
                What is Patryk's technical stack?
                <span className="text-text-muted opacity-50 transition-transform duration-300 group-open:rotate-180">▼</span>
              </summary>
              <p className="px-6 pb-6 text-sm text-text-muted text-left">
                His technical stack includes <strong>React, TypeScript, HTML/CSS, and Tailwind</strong> for Web. For Game/App Development, he builds with <strong>Unreal Engine, Jetpack Compose, Python, and Figma</strong>.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Age Verification Modal */}
      <AnimatePresence>
        {isAgeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsAgeModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-surface-border p-6 rounded-3xl shadow-xl flex flex-col items-center text-center"
            >
              <ShieldAlert className="w-12 h-12 text-red-500/80 mb-4" />
              <h3 className="text-2xl font-display font-bold text-text-main mb-2">Age Verification</h3>
              <p className="text-text-muted mb-6">
                This content is restricted and may contain material not suitable for all audiences. Are you 18 years of age or older?
              </p>
              <div className="flex gap-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsAgeModalOpen(false)}
                >
                  No, leave
                </Button>
                <Button 
                  className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border-red-500/30"
                  onClick={() => {
                    setShowRestricted(true);
                    localStorage.setItem('saderius-restricted', 'true');
                    setIsAgeModalOpen(false);
                  }}
                >
                  Yes, I am 18+
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
