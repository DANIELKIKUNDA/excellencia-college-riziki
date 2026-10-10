export type SchoolService = {
  id: string;
  label: string;
  person: string;
  phone: string | null;
  alternatePhones?: readonly string[];
};

export const SERVICES = [
  { id: 'direction', label: 'Directeur', person: 'Kito', phone: '0978054238' },
  { id: 'secretariat', label: 'Secrétaire', person: 'Fanny', phone: '0977872797' },
  { id: 'prefecture', label: 'Préfet', person: 'Kikunda Ngwej Daniel', phone: '0977712959' },
  { id: 'directeur-etudes', label: 'Directeur des études', person: 'Yumba Wa Nkulu Alphonse', phone: '0853888405' },
  { id: 'administration', label: 'Gestionnaire de l’école', person: 'Fofana Chansa', phone: '0961247956' },
  { id: 'discipline', label: 'Directeur de discipline', person: 'Katumbe Élisée', phone: '0976869675' },
  { id: 'coordonnateur', label: 'Coordonnateur', person: 'Abbé Jean', phone: '+393208455568', alternatePhones: ['0834760032'] },
] as const satisfies readonly SchoolService[];

export type ServiceId = typeof SERVICES[number]['id'];

export const SCHOOL = {
  name: 'EXCELLENCIA COLLÈGE RIZIKI',
  motto: 'Discipline, Travail, Excellence',
  address: 'Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa',
  email: 'excellenciacollegeriziki@gmail.com',
  website: 'https://excellenciariziki.com',
  director: { name: 'Kito', phone: '0978054238', whatsapp: '243978054238' },
};
