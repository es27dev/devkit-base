// Mock job listings for Career page
export interface JobListing {
  id: string;
  title: string;
  location: 'Heidelberg' | 'Berlin' | 'Hamburg';
  entryLevel: string;
  employmentType: string;
  tasks: string[];
  profileRequirements: string[];
  active: boolean;
}

export const mockJobListings: JobListing[] = [
  {
    id: 'job-001',
    title: 'Technischer Facility Manager (m/w/d)',
    location: 'Heidelberg',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Wartung und Instandhaltung technischer Anlagen',
      'Koordination von Dienstleistern und Subunternehmern',
      'Dokumentation und Reporting in digitalen Systemen'
    ],
    profileRequirements: [
      'Abgeschlossene technische Ausbildung oder Studium',
      '3+ Jahre Erfahrung im Facility Management',
      'Führerschein Klasse B'
    ],
    active: true
  },
  {
    id: 'job-002',
    title: 'Compliance Manager FM (m/w/d)',
    location: 'Berlin',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Überwachung der Betreiberverantwortung nach BetrSichV',
      'Erstellung und Pflege von Compliance-Dokumentation',
      'Koordination von Prüfungen und Zertifizierungen'
    ],
    profileRequirements: [
      'Studium in technischer oder juristischer Richtung',
      'Erfahrung in Compliance oder Facility Management',
      'Kenntnisse in BetrSichV, DGUV und Baurecht'
    ],
    active: true
  },
  {
    id: 'job-003',
    title: 'Energie- und Nachhaltigkeitsberater (m/w/d)',
    location: 'Hamburg',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Energieaudits und Optimierungskonzepte erstellen',
      'Nachhaltigkeitsstrategien für Immobilienportfolios entwickeln',
      'Kundenberatung zu Energieeffizienz und ESG-Compliance'
    ],
    profileRequirements: [
      'Studium der Energie- oder Umwelttechnik',
      'Zertifizierung als Energieberater erwünscht',
      'Kenntnisse in ESG und Nachhaltigkeitsstandards'
    ],
    active: true
  },
  {
    id: 'job-004',
    title: 'Junior Projektmanager Digitalisierung (m/w/d)',
    location: 'Heidelberg',
    entryLevel: 'Junior',
    employmentType: 'Vollzeit',
    tasks: [
      'Unterstützung bei Digitalisierungsprojekten im FM',
      'Implementation von IoT-Lösungen und Smart Building Systemen',
      'Datenanalyse und Reporting für Kundenportfolios'
    ],
    profileRequirements: [
      'Studium der Informatik, Wirtschaftsinformatik oder ähnlich',
      'Interesse an IoT und Smart Building Technologien',
      'Erste Erfahrungen im Projektmanagement'
    ],
    active: true
  },
  {
    id: 'job-005',
    title: 'Servicetechniker Infrastruktur (m/w/d)',
    location: 'Berlin',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Wartung und Instandhaltung von Sicherheitstechnik',
      'Koordination von Reinigungsdiensten und Empfang',
      'Qualitätskontrolle und Dokumentation von Services'
    ],
    profileRequirements: [
      'Ausbildung in technischem Bereich oder vergleichbar',
      'Erfahrung in Gebäudetechnik oder Sicherheitstechnik',
      'Serviceorientierte Arbeitsweise'
    ],
    active: true
  },
  {
    id: 'job-006',
    title: 'Account Manager Facility Services (m/w/d)',
    location: 'Hamburg',
    entryLevel: 'Berufserfahren',
    employmentType: 'Vollzeit',
    tasks: [
      'Betreuung und Entwicklung von Bestandskunden',
      'Akquise und Vertragsverhandlungen mit Neukunden',
      'Koordination zwischen Kunden und operativen Teams'
    ],
    profileRequirements: [
      'Kaufmännische Ausbildung oder Studium',
      'Vertriebserfahrung im B2B-Bereich, idealerweise FM',
      'Verhandlungssichere Kommunikation und Präsentation'
    ],
    active: true
  }
];