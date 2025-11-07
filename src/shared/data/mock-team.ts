// Mock team member profiles for Career page
export interface TeamMemberProfile {
  id: string;
  name: string;
  role: string;
  focus: string;
  photoUrl?: string;
  displayOrder: number;
}

export const mockTeamProfiles: TeamMemberProfile[] = [
  {
    id: 'team-001',
    name: 'Dr. Stefan Müller',
    role: 'Geschäftsführer',
    focus: 'Spezialist für nachhaltige Gebäudetechnik und strategische Unternehmensentwicklung',
    photoUrl: '/assets/team/stefan-mueller.jpg',
    displayOrder: 1
  },
  {
    id: 'team-002',
    name: 'Mario Unger-Faulhaber',
    role: 'Vertriebsleiter',
    focus: 'Experte für Kundenberatung und maßgeschneiderte FM-Lösungen',
    photoUrl: '/assets/team/mario-unger-faulhaber.jpg',
    displayOrder: 2
  },
  {
    id: 'team-003',
    name: 'Anna Weber',
    role: 'Technische Facility Managerin',
    focus: 'Fokussiert auf technische Anlagenoptimierung und Energieeffizienz',
    photoUrl: '/assets/team/anna-weber.jpg',
    displayOrder: 3
  },
  {
    id: 'team-004',
    name: 'Thomas Schmidt',
    role: 'Compliance Manager',
    focus: 'Verantwortlich für Betreiberverantwortung und rechtssichere Dokumentation',
    photoUrl: '/assets/team/thomas-schmidt.jpg',
    displayOrder: 4
  },
  {
    id: 'team-005',
    name: 'Lisa Chen',
    role: 'Digitalisierungsexpertin',
    focus: 'Entwickelt innovative IoT-Lösungen und Smart Building Konzepte',
    photoUrl: '/assets/team/lisa-chen.jpg',
    displayOrder: 5
  },
  {
    id: 'team-006',
    name: 'Michael Braun',
    role: 'Projektmanager Nachhaltigkeit',
    focus: 'Leitet ESG-Projekte und entwickelt Nachhaltigkeitsstrategien',
    photoUrl: '/assets/team/michael-braun.jpg',
    displayOrder: 6
  },
  {
    id: 'team-007',
    name: 'Sarah Hoffmann',
    role: 'Serviceleiterin',
    focus: 'Koordiniert infrastrukturelle Services und Qualitätsmanagement',
    photoUrl: '/assets/team/sarah-hoffmann.jpg',
    displayOrder: 7
  },
  {
    id: 'team-008',
    name: 'Robert Fischer',
    role: 'Technischer Berater',
    focus: 'Spezialist für HVAC-Systeme und Gebäudeautomation',
    photoUrl: '/assets/team/robert-fischer.jpg',
    displayOrder: 8
  }
];