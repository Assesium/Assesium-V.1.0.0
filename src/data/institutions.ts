export const institutions = [
  { id: 1, name: 'Cambridge High School', country: 'United Kingdom' },
  { id: 2, name: 'Oxford Academy', country: 'United Kingdom' },
  { id: 3, name: 'Stanford University', country: 'United States' },
  { id: 4, name: 'MIT Preparatory', country: 'United States' },
  { id: 5, name: 'Harvard Secondary School', country: 'United States' },
  { id: 6, name: 'Yale International School', country: 'United States' },
  { id: 7, name: 'Princeton Academy', country: 'United States' },
  { id: 8, name: 'ETH Zurich High School', country: 'Switzerland' },
  { id: 9, name: 'Tokyo International Academy', country: 'Japan' },
  { id: 10, name: 'Seoul Science High School', country: 'South Korea' },
  { id: 11, name: 'Melbourne Grammar School', country: 'Australia' },
  { id: 12, name: 'Toronto Prep School', country: 'Canada' },
  { id: 13, name: 'Paris International School', country: 'France' },
  { id: 14, name: 'Berlin Academic Institute', country: 'Germany' },
  { id: 15, name: 'Singapore Science Academy', country: 'Singapore' },
  { id: 16, name: 'Dubai International School', country: 'UAE' },
  { id: 17, name: 'Mumbai International Academy', country: 'India' },
  { id: 18, name: 'Cape Town Preparatory', country: 'South Africa' },
  { id: 19, name: 'São Paulo Academy', country: 'Brazil' },
  { id: 20, name: 'Moscow Science School', country: 'Russia' }
];

export const countries = Array.from(new Set(institutions.map(inst => inst.country))).sort();