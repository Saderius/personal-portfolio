import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Github, ShieldAlert } from 'lucide-react';
import { projects, categories, ProjectCategory } from '@/src/data/projects';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { SeoHead } from '@/src/components/SeoHead';

export function Category() {
  const { id } = useParams<{ id: string }>();
  const [revealedProjects, setRevealedProjects] = useState<Set<string>>(new Set());
  const [pendingRevealId, setPendingRevealId] = useState<string | null>(null);
  const category = categories.find(c => c.id === id);
  
  const categoryProjects = projects.filter(p => p.category === id as ProjectCategory);

  if (!category) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-display font-bold mb-4 text-text-main">Category not found</h1>
        <Link to="/">
          <Button variant="glass">Return Home</Button>
        </Link>
      </div>
    );
  }

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId.toLowerCase()) {
      case 'games': return 'text-category-primary';
      case 'apps': return 'text-category-secondary';
      default: return 'text-text-main';
    }
  };

  return (
    <div className="pt-32 pb-20 container mx-auto px-4 md:px-6">
      <SeoHead 
        title={`${category.title} Portfolio | Patryk Mroziński`}
        description={category.description}
        url={`https://saderius.com/category/${category.id}`}
      />
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-main mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h1 className={cn("text-4xl md:text-5xl font-display font-bold", getCategoryColor(category.id))}>
            {category.title}
          </h1>
        </div>
        <p className="text-xl text-text-muted max-w-2xl">{category.description}</p>
      </div>

      {categoryProjects.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-text-muted">More projects coming soon to this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProjects.map((project) => {
            const isHidden = project.mature && !revealedProjects.has(project.id);
            
            return (
            <Card 
              key={project.id} 
              className="h-full flex flex-col group/card border-surface-border hover:border-primary/50 relative overflow-hidden"
              style={isHidden ? { backdropFilter: 'none', WebkitBackdropFilter: 'none' } : undefined}
            >
              {isHidden && (
                <div className="absolute inset-0 z-30 bg-background/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                  {pendingRevealId === project.id ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <ShieldAlert className="w-12 h-12 text-red-500/80 mb-4" />
                      <h3 className="text-xl font-display font-bold text-text-main mb-2">Are you sure?</h3>
                      <p className="text-sm text-text-muted mb-6">This project contains mature content.</p>
                      <div className="flex gap-3 w-full justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setPendingRevealId(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setRevealedProjects(prev => {
                              const newSet = new Set(prev);
                              newSet.add(project.id);
                              return newSet;
                            });
                            setPendingRevealId(null);
                          }}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border-red-500/30"
                        >
                          Reveal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center animate-in fade-in duration-300">
                      <ShieldAlert className="w-12 h-12 text-red-500/80 mb-4" />
                      <h3 className="text-xl font-display font-bold text-text-main mb-2">Mature Content</h3>
                      <p className="text-sm text-text-muted mb-4">This project contains content that may not be suitable for all audiences.</p>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          setPendingRevealId(project.id);
                        }}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border-red-500/30"
                      >
                        Reveal Project
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <div className={cn("flex flex-col h-full overflow-hidden rounded-3xl transition-all duration-300", isHidden && "select-none")}>
                {project.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-x-0 -bottom-px h-16 bg-gradient-to-t from-background to-transparent z-10" />
                    <img 
                      src={project.imageUrl} 
                      alt={isHidden ? "Hidden Content" : project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                  </div>
                )}
                <CardContent className="flex flex-col flex-1 p-6 pt-6 relative z-20">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-bold text-text-main">
                        {isHidden ? "Hidden Title" : project.title}
                      </h3>
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
                  <p className="text-sm text-text-muted mb-6 flex-1">
                    {isHidden ? "Hidden content. Click to reveal." : project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-glass-icon text-text-muted border border-surface-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    {project.link && (
                      <a href={isHidden ? "#" : project.link} target={isHidden ? "_self" : "_blank"} rel="noreferrer" className="flex-1" onClick={isHidden ? (e) => e.preventDefault() : undefined}>
                        <Button variant="glass" className="w-full gap-2" disabled={isHidden}>
                          View <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {project.github && (
                      <a href={isHidden ? "#" : project.github} target={isHidden ? "_self" : "_blank"} rel="noreferrer" onClick={isHidden ? (e) => e.preventDefault() : undefined}>
                        <Button variant="glass" size="icon" disabled={isHidden}>
                          <Github className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}
