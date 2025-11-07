// External Libraries
import { useTranslation } from "react-i18next";

// Components
import { Card, CardContent } from "@/components/base/card";

// Types
import type { TeamMemberProfile } from "@/shared/data/mock-team";

// Hooks

// Translations

// Data Loading

// Early Returns

// Computed Data

// Event Handlers

// Effects

export interface TeamProfileProps {
  member: TeamMemberProfile;
}

export function TeamProfile({ member }: TeamProfileProps) {
  // Hooks

  // Translations

  // Data Loading

  // Early Returns

  // Computed Data

  // Event Handlers

  // Effects

  return (
    <Card className="h-full">
      <CardContent className="p-6 text-center">
        {member.photoUrl && (
          <div className="mb-4">
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto object-cover bg-muted"
              onError={(e) => {
                // Hide broken images gracefully
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
        <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{member.focus}</p>
      </CardContent>
    </Card>
  );
}