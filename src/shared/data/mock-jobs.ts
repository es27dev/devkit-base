// Job listings - content loaded from i18n
export interface JobListing {
  id: string;
  i18nKey: string; // Key in jobs.json (e.g., "haustechniker-frankfurt")
  active: boolean;
}

// Job IDs to display - actual content comes from i18n/jobs/de.json
export const mockJobListings: JobListing[] = [
  {
    id: 'job-001',
    i18nKey: 'haustechniker-frankfurt',
    active: true
  },
  {
    id: 'job-002',
    i18nKey: 'haustechniker-berlin',
    active: true
  },
  {
    id: 'job-003',
    i18nKey: 'haustechniker-heidelberg',
    active: true
  },
  {
    id: 'job-004',
    i18nKey: 'haustechniker-heilbronn',
    active: true
  },
  {
    id: 'job-005',
    i18nKey: 'haustechniker-leipzig',
    active: true
  },
  {
    id: 'job-006',
    i18nKey: 'haustechniker-mannheim',
    active: true
  },
  {
    id: 'job-007',
    i18nKey: 'haustechniker-wiesbaden',
    active: true
  }
];