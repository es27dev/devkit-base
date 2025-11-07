// T014: Mock project references data - 6-8 projects with images and impact statements
export interface ProjectReference {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

export const mockProjectReferences: ProjectReference[] = [
  {
    id: 'project-001',
    title: 'Bürokomplex Berlin Mitte',
    description: '20% Energieeinsparung durch optimierte Gebäudeleittechnik',
    imageUrl: '/assets/projects/berlin-mitte.jpg',
    displayOrder: 1
  },
  {
    id: 'project-002',
    title: 'Produktionsstandort Hamburg',
    description: '95% Anlagenverfügbarkeit durch präventive Wartungsstrategien',
    imageUrl: '/assets/projects/hamburg-produktion.jpg',
    displayOrder: 2
  },
  {
    id: 'project-003',
    title: 'Forschungszentrum Heidelberg',
    description: 'ISO 14001 Zertifizierung erreicht durch nachhaltiges Facility Management',
    imageUrl: '/assets/projects/heidelberg-forschung.jpg',
    displayOrder: 3
  },
  {
    id: 'project-004',
    title: 'Logistikzentrum Frankfurt',
    description: '30% Kostenreduzierung durch integriertes CAFM-System',
    imageUrl: '/assets/projects/frankfurt-logistik.jpg',
    displayOrder: 4
  },
  {
    id: 'project-005',
    title: 'Verwaltungsgebäude München',
    description: '99,8% Betriebssicherheit durch proaktives Störungsmanagement',
    imageUrl: '/assets/projects/muenchen-verwaltung.jpg',
    displayOrder: 5
  },
  {
    id: 'project-006',
    title: 'Campus Köln',
    description: '25% weniger CO2-Emissionen durch intelligente Gebäudeautomation',
    imageUrl: '/assets/projects/koeln-campus.jpg',
    displayOrder: 6
  }
];