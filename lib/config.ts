export const SERVICES = [
  { id: 'prefecture', label: 'Préfecture', phone: '0977712959' },
  { id: 'secretariat', label: 'Secrétariat', phone: '0977872797' },
  { id: 'direction', label: 'Direction / Administration', phone: '0961247956' },
  { id: 'directeur-etudes', label: 'Directeur des études', phone: '0853888405' },
  { id: 'discipline', label: 'Direction de discipline', phone: '0976869675' },
  { id: 'coordonnateur', label: 'Coordonnateur', phone: '+393208455568', alternatePhones: ['0834760032'] },
  { id: 'primaire', label: 'Direction primaire', phone: null },
] as const;

export type ServiceId = typeof SERVICES[number]['id'];

export const SCHOOL = {
  name: 'EXCELLENCIA COLLÈGE RIZIKI',
  motto: 'Discipline, Travail, Excellence',
  address: 'Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa',
  email: 'excellenciacollegeriziki@gmail.com',
  website: 'https://excellenciariziki.com',
};
