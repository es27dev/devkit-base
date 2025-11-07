// T013: Mock customer logos data - 8-12 logos for client references
export interface CustomerLogo {
  id: string;
  companyName: string;
  logoUrl: string;
  displayOrder: number;
}

export const mockCustomerLogos: CustomerLogo[] = [
  {
    id: 'customer-001',
    companyName: 'Deutsche Bahn AG',
    logoUrl: '/assets/logos/deutsche-bahn.svg',
    displayOrder: 1
  },
  {
    id: 'customer-002',
    companyName: 'Siemens AG',
    logoUrl: '/assets/logos/siemens.svg',
    displayOrder: 2
  },
  {
    id: 'customer-003',
    companyName: 'BMW Group',
    logoUrl: '/assets/logos/bmw.svg',
    displayOrder: 3
  },
  {
    id: 'customer-004',
    companyName: 'SAP SE',
    logoUrl: '/assets/logos/sap.svg',
    displayOrder: 4
  },
  {
    id: 'customer-005',
    companyName: 'Volkswagen AG',
    logoUrl: '/assets/logos/volkswagen.svg',
    displayOrder: 5
  },
  {
    id: 'customer-006',
    companyName: 'BASF SE',
    logoUrl: '/assets/logos/basf.svg',
    displayOrder: 6
  },
  {
    id: 'customer-007',
    companyName: 'Bosch GmbH',
    logoUrl: '/assets/logos/bosch.svg',
    displayOrder: 7
  },
  {
    id: 'customer-008',
    companyName: 'Allianz SE',
    logoUrl: '/assets/logos/allianz.svg',
    displayOrder: 8
  },
  {
    id: 'customer-009',
    companyName: 'Lufthansa Group',
    logoUrl: '/assets/logos/lufthansa.svg',
    displayOrder: 9
  },
  {
    id: 'customer-010',
    companyName: 'Merck KGaA',
    logoUrl: '/assets/logos/merck.svg',
    displayOrder: 10
  }
];