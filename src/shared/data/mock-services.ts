// T012: Mock services data - 5 core services for PACON Real Estate
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  displayOrder: number;
}

export const mockServices: ServiceItem[] = [
  {
    id: 'service-001',
    title: 'Technisches FM',
    description: 'Wartung, Instandhaltung und Störungsbeseitigung aller technischen Anlagen',
    iconName: 'wrench',
    displayOrder: 1
  },
  {
    id: 'service-002',
    title: 'Infrastrukturelle Services',
    description: 'Reinigung, Sicherheit, Empfangsdienste und Catering-Management',
    iconName: 'building',
    displayOrder: 2
  },
  {
    id: 'service-003',
    title: 'Betreiberverantwortung & Compliance',
    description: 'Rechtssichere Betriebsführung und Einhaltung aller Vorschriften',
    iconName: 'shield-check',
    displayOrder: 3
  },
  {
    id: 'service-004',
    title: 'Energie & Nachhaltigkeit',
    description: 'Energieoptimierung, CO2-Reduktion und nachhaltige Gebäudebewirtschaftung',
    iconName: 'leaf',
    displayOrder: 4
  },
  {
    id: 'service-005',
    title: 'Digitalisierung & Reporting',
    description: 'CAFM-Systeme, IoT-Integration und transparente Datenanalyse',
    iconName: 'chart-bar',
    displayOrder: 5
  }
];