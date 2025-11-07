// T023: Project gallery block component - showcase project references with images
import { ProjectReference } from '@/shared/data/mock-projects';

// Hooks
// (none)

// Translations
// (none - content provided via props)

// Data Loading
// (none - displays provided data)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none)

// Effects
// (none)

export interface ProjectGalleryProps {
  projects: ProjectReference[];
  className?: string;
  variant?: 'grid' | 'carousel';
  maxItems?: number;
}

export function ProjectGallery({
  projects,
  className = '',
  variant = 'grid',
  maxItems = projects.length
}: ProjectGalleryProps) {
  const sortedProjects = [...projects]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, maxItems);

  if (variant === 'carousel') {
    return (
      <div className={`flex gap-6 overflow-x-auto pb-4 ${className}`}>
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="flex-none w-80"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {sortedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectReference;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow">
      <div className="relative overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>
    </div>
  );
}