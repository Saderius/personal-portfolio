import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/src/data/projects';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface CarouselProps {
  projects: Project[];
}

export function ProjectCarousel({ projects }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group">
      <div className="overflow-hidden py-6 -my-6 px-4 -mx-4" ref={emblaRef}>
        <div className="flex -ml-4">
          {projects.map((project) => (
            <div key={project.id} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <Card className="h-full flex flex-col group/card border-surface-border hover:border-primary/50">
                <div className="flex flex-col h-full overflow-hidden rounded-3xl">
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
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
                        <span className="text-xs font-medium uppercase tracking-wider text-primary">
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
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-text-main opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-text-main opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
