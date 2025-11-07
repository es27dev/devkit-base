// T015: Mock testimonials data - customer and employee quotes for testimonial sections
export interface Testimonial {
  id: string;
  text: string;
  author?: string;
  authorFunction?: string;
  type: 'customer' | 'employee';
  displayOrder: number;
}

export const mockTestimonials: Testimonial[] = [
  // Customer testimonials for About page (FR-025)
  {
    id: 'testimonial-001',
    text: 'pacon hat unsere Facility-Management-Prozesse revolutioniert. Transparenz und Effizienz auf höchstem Niveau.',
    author: 'Michael Schmidt',
    authorFunction: 'Leiter Facility Management, Deutsche Bahn AG',
    type: 'customer',
    displayOrder: 1
  },
  {
    id: 'testimonial-002',
    text: 'Dank pacon konnten wir unsere Betriebskosten um 25% senken, ohne Qualitätsverluste.',
    author: 'Dr. Sarah Weber',
    authorFunction: 'Geschäftsführerin, Siemens Real Estate',
    type: 'customer',
    displayOrder: 2
  },
  {
    id: 'testimonial-003',
    text: 'Die proaktive Wartungsstrategie von pacon hat unsere Anlagenverfügbarkeit deutlich erhöht.',
    author: 'Thomas Müller',
    authorFunction: 'Technischer Leiter, BMW Group',
    type: 'customer',
    displayOrder: 3
  },

  // Employee testimonials for Career page (FR-030)
  {
    id: 'testimonial-004',
    text: 'Die Weiterbildungsmöglichkeiten und das Team bei pacon sind unübertroffen. Hier kann ich mich wirklich entwickeln.',
    author: 'Anna Weber',
    authorFunction: 'Technische Facility Managerin',
    type: 'employee',
    displayOrder: 1
  },
  {
    id: 'testimonial-005',
    text: 'pacon bietet ein perfektes Umfeld für Innovation. Meine Ideen werden gehört und umgesetzt.',
    author: 'Marcus Fischer',
    authorFunction: 'Digitalisierungsexperte',
    type: 'employee',
    displayOrder: 2
  },
  {
    id: 'testimonial-006',
    text: 'Work-Life-Balance wird hier großgeschrieben. Flexible Arbeitszeiten und ein tolles Team machen den Unterschied.',
    author: 'Julia Hoffmann',
    authorFunction: 'Projektmanagerin',
    type: 'employee',
    displayOrder: 3
  },
  {
    id: 'testimonial-007',
    text: 'Als Berufseinsteiger wurde ich vom ersten Tag an unterstützt. Mentoring und klare Karrierewege sind selbstverständlich.',
    author: 'David Klein',
    authorFunction: 'Junior Facility Manager',
    type: 'employee',
    displayOrder: 4
  },
  {
    id: 'testimonial-008',
    text: 'Die Vielfalt der Projekte und die moderne Ausstattung machen die Arbeit bei pacon zu einem echten Vergnügen.',
    author: 'Sandra Bauer',
    authorFunction: 'Compliance-Beraterin',
    type: 'employee',
    displayOrder: 5
  }
];