// T020: Mock certifications data - ISO badges and certifications
export interface CertificationItem {
  id: string;
  name: string;
  description: string;
  badgeUrl: string;
  validUntil?: string;
  displayOrder: number;
}

export const mockCertifications: CertificationItem[] = [
  {
    id: 'cert-001',
    name: 'ISO 9001:2015',
    description: 'Qualitätsmanagementsystem',
    badgeUrl: '/assets/certifications/iso-9001.svg',
    validUntil: '2025-12-31',
    displayOrder: 1
  },
  {
    id: 'cert-002',
    name: 'ISO 14001:2015',
    description: 'Umweltmanagementsystem',
    badgeUrl: '/assets/certifications/iso-14001.svg',
    validUntil: '2025-10-15',
    displayOrder: 2
  },
  {
    id: 'cert-003',
    name: 'GEFMA 444',
    description: 'Qualifizierung für FM-Dienstleister',
    badgeUrl: '/assets/certifications/gefma-444.svg',
    validUntil: '2026-06-30',
    displayOrder: 3
  },
  {
    id: 'cert-004',
    name: 'VDI 6000',
    description: 'Ausstattung von und mit Gebäuden',
    badgeUrl: '/assets/certifications/vdi-6000.svg',
    displayOrder: 4
  }
];