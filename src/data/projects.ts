import fm from 'front-matter';

export type ProjectCategory = 'games' | 'apps' | 'design' | 'python';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  imageUrl?: string;
  link?: string;
  github?: string;
  tags: string[];
  featured?: boolean;
  date?: string;
  status?: 'active' | 'concluded';
}

// Use Vite's import.meta.glob to load all markdown files in the content folder
const markdownFiles = import.meta.glob('/src/content/projects/*.md', { query: '?raw', import: 'default', eager: true });

export const projects: Project[] = Object.entries(markdownFiles).map(([filepath, content]) => {
  // Extract filename without extension to use as ID
  const id = filepath.split('/').pop()?.replace('.md', '') || '';
  
  // Parse frontmatter
  const parsed = fm<Omit<Project, 'id'>>(content as string);
  
  return {
    id,
    ...parsed.attributes
  };
}).sort((a, b) => {
  // Sort by date descending by default
  if (!a.date) return 1;
  if (!b.date) return -1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export const categories = [
  { id: 'games', title: 'Games', description: 'Titles I have worked on as QA Lead and Designer.' },
  { id: 'apps', title: 'Applications', description: 'Web and mobile applications I have developed.' },
  { id: 'design', title: 'Design & QA', description: 'Showcasing my skills in UI/UX and Quality Assurance.' },
  { id: 'python', title: 'Python Projects', description: 'Scripts, automation, and backend projects.' }
];
