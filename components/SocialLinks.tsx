const socials = [
  ['YouTube', process.env.NEXT_PUBLIC_YOUTUBE_URL],
  ['Facebook', process.env.NEXT_PUBLIC_FACEBOOK_URL],
  ['TikTok', process.env.NEXT_PUBLIC_TIKTOK_URL],
] as const;

export default function SocialLinks() {
  const active = socials.filter(([, url]) => Boolean(url));
  if (!active.length) return <p><small>Liens officiels à ajouter après création des comptes</small></p>;
  return (
    <div className="socialLinks" aria-label="Réseaux sociaux officiels">
      {active.map(([name, url]) => <a key={name} href={url!} target="_blank" rel="noreferrer">{name}</a>)}
    </div>
  );
}
