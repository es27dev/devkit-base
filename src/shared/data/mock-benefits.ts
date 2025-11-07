// Mock employee benefits for Career page
export interface BenefitTile {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  displayOrder: number;
}

export const mockBenefits: BenefitTile[] = [
  {
    id: 'benefit-001',
    title: 'Karriereentwicklung',
    description: 'Individuelle Förderpläne und klare Aufstiegsperspektiven in allen Bereichen',
    iconName: 'trending-up',
    displayOrder: 1
  },
  {
    id: 'benefit-002',
    title: 'Weiterbildung',
    description: 'Regelmäßige Schulungen, Zertifizierungen und Zugang zu Fachkonferenzen',
    iconName: 'graduation-cap',
    displayOrder: 2
  },
  {
    id: 'benefit-003',
    title: 'Work-Life-Balance',
    description: 'Flexible Arbeitszeiten, Homeoffice-Möglichkeiten und 30 Tage Urlaub',
    iconName: 'balance-scale',
    displayOrder: 3
  },
  {
    id: 'benefit-004',
    title: 'Teamgeist',
    description: 'Offene Kommunikation, regelmäßige Events und kollegiale Zusammenarbeit',
    iconName: 'users',
    displayOrder: 4
  },
  {
    id: 'benefit-005',
    title: 'Anerkennung',
    description: 'Leistungsgerechte Vergütung, Bonussystem und öffentliche Wertschätzung',
    iconName: 'award',
    displayOrder: 5
  },
  {
    id: 'benefit-006',
    title: 'Vielfalt',
    description: 'Inklusive Arbeitskultur mit Respekt für unterschiedliche Perspektiven',
    iconName: 'globe',
    displayOrder: 6
  },
  {
    id: 'benefit-007',
    title: 'Gesundheit',
    description: 'Gesundheitsvorsorge, Fitnessstudio-Zuschuss und ergonomische Arbeitsplätze',
    iconName: 'heart',
    displayOrder: 7
  },
  {
    id: 'benefit-008',
    title: 'Innovation',
    description: 'Modernste Technologien, eigene Projektverantwortung und Innovationszeit',
    iconName: 'lightbulb',
    displayOrder: 8
  }
];