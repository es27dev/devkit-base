// Team section block - displays team members in grid layout with social links
import { useTranslation } from 'react-i18next';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/base/button';
import { cn } from '@/shared/lib/utils';

// Types
import type { TeamMemberProfile } from '@/shared/data/mock-team';

// Hooks
// Translations
// Data Loading
// Early Returns
// Computed Data
// Event Handlers
// Effects

export interface TeamSectionProps {
  members: TeamMemberProfile[];
  className?: string;
  showHeader?: boolean;
  showCTA?: boolean;
}

export function TeamSection({
  members,
  className,
  showHeader = true,
  showCTA = true
}: TeamSectionProps) {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  const { t } = useTranslation();

  // 3. DATA LOADING
  // (passed via props)

  // 4. EARLY RETURNS
  if (!members || members.length === 0) {
    return null;
  }

  // 5. COMPUTED DATA
  const sortedMembers = [...members].sort((a, b) => a.displayOrder - b.displayOrder);

  // 6. EVENT HANDLERS
  // (none)

  // 7. EFFECTS
  // (none)

  return (
    <div className={cn('flex flex-col justify-center py-8 sm:py-12 px-6 lg:px-8 max-w-screen-xl mx-auto gap-16', className)}>
      {showHeader && (
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground text-base font-semibold">
            {t('team.hiring')}
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            {t('team.title')}
          </h2>
          <p className="mt-6 text-base sm:text-lg">
            {t('team.description')}
          </p>
          {showCTA && (
            <div className="mt-8 flex flex-col sm:flex-row-reverse sm:justify-center gap-3">
              <Button size="lg">{t('team.openPositions')}</Button>
              <Button size="lg" variant="outline">
                {t('team.aboutUs')}
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {sortedMembers.map((member) => (
          <div key={member.id}>
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={cn(
                  "w-full h-full bg-secondary rounded-lg flex items-center justify-center text-2xl font-semibold text-muted-foreground",
                  member.photoUrl ? "hidden" : "flex"
                )}
              >
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
            <p className="text-muted-foreground text-sm">{member.role}</p>
            <p className="mt-3 text-sm">{member.focus}</p>

            {member.socialLinks && (
              <div className="mt-4 flex items-center gap-2.5">
                {member.socialLinks.twitter && (
                  <Button
                    className="bg-accent hover:bg-accent/80 text-muted-foreground shadow-none"
                    size="icon"
                    asChild
                  >
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on Twitter`}
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.socialLinks.linkedin && (
                  <Button
                    className="bg-accent hover:bg-accent/80 text-muted-foreground shadow-none"
                    size="icon"
                    asChild
                  >
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.socialLinks.github && (
                  <Button
                    className="bg-accent hover:bg-accent/80 text-muted-foreground shadow-none"
                    size="icon"
                    asChild
                  >
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
