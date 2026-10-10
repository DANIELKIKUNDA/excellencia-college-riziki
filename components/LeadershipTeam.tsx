'use client';

import { useSchoolServices } from '@/lib/use-site-data';

export default function LeadershipTeam() {
  const services = useSchoolServices();
  return <div className="leadershipGrid">{services.map(person => <article className="leadershipCard" key={person.id}><span className="leaderInitials" aria-hidden="true">{person.person.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><p>{person.label}</p><h3>{person.person}</h3></article>)}</div>;
}
