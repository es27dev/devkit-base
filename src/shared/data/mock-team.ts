// Mock team member profiles for Career page
export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  focus: string;
  photoUrl?: string;
  displayOrder: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const mockTeamProfiles: TeamMemberProfile[] = [
  {
    id: 'team-001',
    name: 'Dr. Stefan Müller',
    role: 'Geschäftsführer',
    focus: 'Spezialist für nachhaltige Gebäudetechnik und strategische Unternehmensentwicklung',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    displayOrder: 1,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'team-002',
    name: 'Mario Unger-Faulhaber',
    role: 'Vertriebsleiter',
    focus: 'Experte für Kundenberatung und maßgeschneiderte FM-Lösungen',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    displayOrder: 2,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'team-003',
    name: 'Anna Weber',
    role: 'Technische Facility Managerin',
    focus: 'Fokussiert auf technische Anlagenoptimierung und Energieeffizienz',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    displayOrder: 3,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  },
  {
    id: 'team-004',
    name: 'Thomas Schmidt',
    role: 'Compliance Manager',
    focus: 'Verantwortlich für Betreiberverantwortung und rechtssichere Dokumentation',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    displayOrder: 4,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'team-005',
    name: 'Lisa Chen',
    role: 'Digitalisierungsexpertin',
    focus: 'Entwickelt innovative IoT-Lösungen und Smart Building Konzepte',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    displayOrder: 5,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com'
    }
  },
  {
    id: 'team-006',
    name: 'Michael Braun',
    role: 'Projektmanager Nachhaltigkeit',
    focus: 'Leitet ESG-Projekte und entwickelt Nachhaltigkeitsstrategien',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    displayOrder: 6,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'team-007',
    name: 'Sarah Hoffmann',
    role: 'Serviceleiterin',
    focus: 'Koordiniert infrastrukturelle Services und Qualitätsmanagement',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    displayOrder: 7,
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'team-008',
    name: 'Robert Fischer',
    role: 'Technischer Berater',
    focus: 'Spezialist für HVAC-Systeme und Gebäudeautomation',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    displayOrder: 8,
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  }
];