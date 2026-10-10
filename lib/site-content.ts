export const levels = [
  { title: 'Maternelle', text: '1ère, 2ème et 3ème maternelle' },
  { title: 'Primaire', text: 'De la 1ère à la 6ème primaire' },
  { title: 'Éducation de base', text: '7ème et 8ème EB' },
  { title: 'Humanités', text: 'De la 1ère à la 4ème des Humanités' },
];

export const options = [
  ['MA', 'Mécanique automobile'], ['MG', 'Mécanique générale'], ['ELEC', 'Électricité générale'],
  ['CG', 'Commerciale de gestion'], ['HP', 'Pédagogie générale'], ['TCC', 'Technique coupe et couture'], ['SC', 'Sciences'],
];

export const campusPhotos = [
  { src: '/images/final/1000240773.webp', alt: 'Vue réelle du campus et de la cour de EXCELLENCIA COLLÈGE RIZIKI', title: 'Notre campus', tag: 'Cadre scolaire' },
  { src: '/images/final/1000240757.webp', alt: 'Vue réelle d’un bâtiment de EXCELLENCIA COLLÈGE RIZIKI', title: 'Bâtiments scolaires', tag: 'Campus' },
  { src: '/images/final/1000240769.webp', alt: 'Espace extérieur réel de EXCELLENCIA COLLÈGE RIZIKI', title: 'Vie du campus', tag: 'Environnement' },
  { src: '/images/final/1000240754.webp', alt: 'Cour réelle de EXCELLENCIA COLLÈGE RIZIKI', title: 'Cour de l’établissement', tag: 'Campus' },
  { src: '/images/final/image-1791619552449.webp', alt: 'Salle de classe réelle de EXCELLENCIA COLLÈGE RIZIKI', title: 'Salle de classe', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619565163.webp', alt: 'Salle de classe réelle et équipée de EXCELLENCIA COLLÈGE RIZIKI', title: 'Un cadre d’étude structuré', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619606712.webp', alt: 'Salle de classe réelle de l’établissement', title: 'Espaces pédagogiques', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619633233.webp', alt: 'Salle de maternelle réelle avec écran à EXCELLENCIA COLLÈGE RIZIKI', title: 'Espace maternelle', tag: 'Maternelle' },
];

export const activityPhotos = Array.from({ length: 31 }, (_, index) => {
  const number = index + 1;
  const workshop = number <= 15 || [18, 20, 26].includes(number)
    ? 'Électricité générale'
    : number >= 27 ? 'Mécanique automobile' : 'Mécanique générale';
  return {
    src: `/images/activities/riziki-atelier-${String(number).padStart(2, '0')}.webp`,
    alt: `Photo réelle des élèves de EXCELLENCIA COLLÈGE RIZIKI en atelier de ${workshop.toLowerCase()}`,
    title: workshop,
    tag: 'Formation pratique',
  };
});
