import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { projects, categories, ProjectCategory } from '@/src/data/projects';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';

export function Category() {
  const { id } = useParams<{ id: string }>();
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
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text-main mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className={cn("text-4xl md:text-5xl font-display font-bold mb-4", getCategoryColor(category.id))}>
          {category.title}
        </h1>
        <p className="text-xl text-text-muted max-w-2xl">{category.description}</p>
      </div>

      {categoryProjects.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-text-muted">More projects coming soon to this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProjects.map((project) => (
            <Card key={project.id} className="h-full flex flex-col group/card border-surface-border hover:border-primary/50">
              <div className="flex flex-col h-full overflow-hidden rounded-3xl">
                {project.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
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
                      <h3 className="text-xl font-display font-bold text-text-main">{project.title}</h3>
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
                  <p className="text-sm text-text-muted mb-6 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-glass-icon text-text-muted border border-surface-border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="flex-1">
                        <Button variant="glass" className="w-full gap-2">
                          View <ExternalLink className="w-4 h-4" />
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
      )}
    </div>
  );
}
