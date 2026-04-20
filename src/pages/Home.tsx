import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Gamepad2, PenTool, Terminal, ExternalLink, Github } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<string>('featured');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(9);
  const [isGameActive, setIsGameActive] = useState(false);

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

  const filteredProjects = activeCategory === 'featured' 
    ? projects.filter(p => p.featured)
    : projects.filter(p => p.category === activeCategory);

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
      <section className="container mx-auto px-4 md:px-6 mb-16 relative min-h-[350px]">
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
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10 bg-surface">
              <video 
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                className="w-full h-full object-cover"
              >
                <source src={`${import.meta.env.BASE_URL}Animacja_Trim.mp4`} type="video/mp4" />
              </video>
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
            className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-2 text-primary"
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
            Swiss Army Man
          </motion.h1>

          <motion.h2 
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-text-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Crafting flawless <br className="hidden md:block" />
            <span className="text-gradient">experiences & games</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            I'm Saderius—a versatile QA Lead, Designer, and Developer. I bridge the gap between creative design and technical execution, building intuitive apps and ensuring top-tier quality in hit titles like House Flipper and Agony.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto">Get in touch</Button>
            </Link>
            <a href="/resume.pdf" target="_blank" rel="noreferrer">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                View Resume
              </Button>
            </a>
            <a href="https://github.com/Saderius" target="_blank" rel="noreferrer">
              <Button variant="glass" size="lg" className="w-full sm:w-auto gap-2">
                <ArrowRight className="w-4 h-4" /> GitHub
              </Button>
            </a>
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
                    {visibleProjects.map((project) => (
                      <Card key={project.id} className="h-full flex flex-col group/card border-surface-border hover:border-primary/50">
                        <div className="flex flex-col h-full overflow-hidden rounded-3xl">
                          {project.imageUrl && (
                            <div className="relative h-48 overflow-hidden shrink-0">
                              <div className="absolute inset-x-0 -bottom-px h-16 bg-gradient-to-t from-background to-transparent z-10" />
                              <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                              />
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
                            <h3 className="text-xl font-display font-bold mb-2 text-text-main">{project.title}</h3>
                            <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-3">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-glass-icon text-text-muted border border-surface-border">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-auto">
                              {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="flex-1">
                                  <Button variant="glass" className="w-full gap-2">
                                    View Project <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer">
                                  <Button variant="glass" size="icon">
                                    <Github className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
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
    </div>
  );
}
