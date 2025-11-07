// T019: Mock news updates data - 3 company updates
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  displayOrder: number;
}

export const mockNews: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Neue Zertifizierung ISO 14001:2015 erhalten',
    excerpt: 'pacon Real Estate erweitert Nachhaltigkeitsengagement mit neuer Umweltmanagement-Zertifizierung.',
    content: 'Wir freuen uns, unsere neue ISO 14001:2015 Zertifizierung bekannt zu geben. Diese bestätigt unser Engagement für nachhaltiges Facility Management.',
    publishDate: '2024-10-15',
    displayOrder: 1
  },
  {
    id: 'news-002',
    title: 'Expansion nach München erfolgreich abgeschlossen',
    excerpt: 'Mit neuem Standort München verstärken wir unsere regionale Präsenz in Süddeutschland.',
    content: 'Unser neues Büro in München ermöglicht es uns, unsere Kunden in Bayern noch besser zu betreuen und lokale Facility Management Services anzubieten.',
    publishDate: '2024-09-22',
    displayOrder: 2
  },
  {
    id: 'news-003',
    title: '25 Jahre Erfahrung im Facility Management',
    excerpt: 'Ein Vierteljahrhundert erfolgreiche Gebäudebewirtschaftung - Danke an unsere Kunden und Mitarbeiter.',
    content: 'Seit 1999 betreuen wir erfolgreich Immobilien und haben in 25 Jahren über 500 Projekte realisiert. Das ist nur dank unseres engagierten Teams möglich.',
    publishDate: '2024-08-01',
    displayOrder: 3
  }
];