import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import PublicContent from '@/components/PublicContent';
import PwaControls from '@/components/PwaControls';
import ServiceContacts from '@/components/ServiceContacts';
import MobileNav from '@/components/MobileNav';
import MobileContactDock from '@/components/MobileContactDock';
import Reveal from '@/components/Reveal';
import SocialLinks from '@/components/SocialLinks';
import PhotoGallery from '@/components/PhotoGallery';
import { SCHOOL } from '@/lib/config';


const levels = [
  { title: 'Maternelle', text: '1ère, 2ème et 3ème maternelle' },
  { title: 'Primaire', text: 'De la 1ère à la 6ème primaire' },
  { title: 'Éducation de base', text: '7ème et 8ème EB' },
  { title: 'Humanités', text: 'De la 1ère à la 4ème des Humanités' },
];


const realPhotos = [
  { src: '/images/final/1000240773.webp', alt: 'Vue réelle du campus et de la cour de EXCELLENCIA COLLÈGE RIZIKI', title: 'Notre campus', tag: 'Cadre scolaire' },
  { src: '/images/final/1000240757.webp', alt: 'Vue réelle d’un bâtiment de EXCELLENCIA COLLÈGE RIZIKI', title: 'Bâtiments scolaires', tag: 'Campus' },
  { src: '/images/final/1000240769.webp', alt: 'Espace extérieur réel de EXCELLENCIA COLLÈGE RIZIKI', title: 'Vie du campus', tag: 'Environnement' },
  { src: '/images/final/1000240754.webp', alt: 'Cour réelle de EXCELLENCIA COLLÈGE RIZIKI', title: 'Cour de l’établissement', tag: 'Campus' },
  { src: '/images/final/image-1791619552449.webp', alt: 'Salle de classe réelle de EXCELLENCIA COLLÈGE RIZIKI', title: 'Salle de classe', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619565163.webp', alt: 'Salle de classe réelle et équipée de EXCELLENCIA COLLÈGE RIZIKI', title: 'Un cadre d’étude structuré', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619606712.webp', alt: 'Salle de classe réelle de l’établissement', title: 'Espaces pédagogiques', tag: 'Apprentissage' },
  { src: '/images/final/image-1791619633233.webp', alt: 'Salle de maternelle réelle avec écran à EXCELLENCIA COLLÈGE RIZIKI', title: 'Espace maternelle', tag: 'Maternelle' },
];

const options = [
  ['MA', 'Mécanique automobile'], ['MG', 'Mécanique générale'], ['ELEC', 'Électricité générale'],
  ['CG', 'Commerciale de gestion'], ['HP', 'Pédagogie générale'], ['TCC', 'Technique coupe et couture'], ['SC', 'Sciences'],
];

const activityPhotos = Array.from({ length: 31 }, (_, index) => {
  const number = index + 1;
  const workshop = number <= 15 || [18, 20, 26].includes(number)
    ? 'Électricité générale'
    : number >= 27
      ? 'Mécanique automobile'
      : 'Mécanique générale';
  return {
    src: `/images/activities/riziki-atelier-${String(number).padStart(2, '0')}.webp`,
    alt: `Photo réelle des élèves de EXCELLENCIA COLLÈGE RIZIKI en atelier de ${workshop.toLowerCase()}`,
    title: workshop,
    tag: 'Formation pratique',
  };
});


export default function Home() {
  return (
    <main id="contenu">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context':'https://schema.org', '@type':'School',
        name:'EXCELLENCIA COLLÈGE RIZIKI',
        slogan:'Discipline, Travail, Excellence',
        address:{'@type':'PostalAddress',streetAddress:'Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa'},
        url:SCHOOL.website, email:SCHOOL.email, telephone:['+243977712959','+243977872797','+243961247956','+243853888405','+243976869675'], sameAs:[]
      })}} />
      <header className="topbar">
        <div className="shell topbarInner">
          <span>Avenue College Masombo n°23, quartier Hewa Bora, commune Kampempa</span>
          <span className="topPhones">Préfecture : 0977712959 · Secrétariat : 0977872797</span>
        </div>
      </header>

      <nav className="nav">
        <div className="shell navInner">
          <a className="brand" href="#accueil" aria-label="Accueil Riziki">
            <span className="brandLogo"><Image src="/brand/logo-clean.png" alt="Logo EXCELLENCIA COLLÈGE RIZIKI" fill className="contain" /></span>
            <span><strong>EXCELLENCIA COLLÈGE RIZIKI</strong><small>Discipline · Travail · Excellence</small></span>
          </a>
          <div className="links">
            <a href="#ecole">L’école</a><a href="#formations">Formations</a><a href="#action">Riziki en action</a>
            <a href="#actualites">Actualités</a><a href="#communiques">Communiqués</a><a href="#contact">Contact</a>
          </div>
          <MobileNav />
        </div>
      </nav>

      <section id="accueil" className="hero">
        <Image src="/images/campus-02.jpg" alt="Bâtiment réel de EXCELLENCIA COLLÈGE RIZIKI" fill priority className="heroImage" />
        <div className="heroShade" />
        <div className="shell heroContent">
          <div className="officialPill"><span className="pulseDot"/> Site officiel de l’établissement</div>
          <p className="eyebrow">MATERNELLE · PRIMAIRE · SECONDAIRE</p>
          <h1>EXCELLENCIA<br/><span>COLLÈGE RIZIKI</span></h1>
          <h2>Discipline, Travail, Excellence</h2>
          <p>Une école complète, de la maternelle aux Humanités, engagée dans une formation sérieuse, pratique et tournée vers l’excellence.</p>
          <div className="actions">
            <a className="btn primary" href="#ecole">Découvrir l’école</a>
            <a className="btn glass" href="#action">Voir nos réalisations</a>
            <a className="btn light" href="#contact">Contacter l’école</a>
          </div>
          <PwaControls />
          <div className="heroTrust" aria-label="Repères sur l’établissement">
            <span><strong>3</strong><small>grands niveaux</small></span>
            <span><strong>7</strong><small>options aux Humanités</small></span>
            <span><strong>1re–4e</strong><small>cycle des Humanités</small></span>
          </div>
        </div>
      </section>

      <Reveal><section id="ecole" className="section shell intro">
        <div>
          <p className="sectionKicker">NOTRE ÉTABLISSEMENT</p>
          <h2>Former aujourd’hui les compétences de demain</h2>
          <p>EXCELLENCIA COLLÈGE RIZIKI accompagne les élèves de la maternelle jusqu’à la fin des Humanités. L’établissement associe encadrement, apprentissage académique et formation pratique afin de préparer les élèves à progresser avec discipline, compétence et sens des responsabilités.</p>
          <p>Notre ambition est simple : offrir un cadre sérieux, suivre les élèves avec proximité et rendre visibles les apprentissages par des réalisations concrètes.</p>
        </div>
        <div className="photoCard"><Image src="/images/campus-03.jpg" alt="Cour et bâtiment réel de Riziki" fill className="cover" /></div>
      </section></Reveal>


      <Reveal><section className="section shell valueSection" aria-labelledby="pourquoi-riziki">
        <div className="sectionHead valueHead"><div><p className="sectionKicker">NOTRE ENGAGEMENT</p><h2 id="pourquoi-riziki">Une école qui montre ce qu’elle fait</h2><p>Le site officiel devient un espace de confiance entre l’école, les familles et le public : informations vérifiables, activités réelles et communication directe avec les services concernés.</p></div></div>
        <div className="valueGrid">
          <article className="valueCard"><span className="valueIcon" aria-hidden="true">✓</span><div><h3>Formation complète</h3><p>Un parcours continu de la maternelle aux Humanités, avec des filières générales, pédagogiques, commerciales et techniques.</p></div></article>
          <article className="valueCard"><span className="valueIcon" aria-hidden="true">⚙</span><div><h3>Apprentissage par la pratique</h3><p>Les ateliers et réalisations des élèves seront documentés avec les vraies photos et vidéos produites à Riziki.</p></div></article>
          <article className="valueCard"><span className="valueIcon" aria-hidden="true">↗</span><div><h3>Communication accessible</h3><p>Les familles peuvent appeler, écrire sur WhatsApp ou envoyer une demande formelle au service de leur choix.</p></div></article>
        </div>
      </section></Reveal>

      <Reveal><section id="formations" className="section soft">
        <div className="shell">
          <div className="sectionHead"><div><p className="sectionKicker">PARCOURS SCOLAIRE</p><h2>Nos niveaux d’enseignement</h2></div></div>
          <div className="cards four">{levels.map((x) => <article className="card" key={x.title}><div className="dot"/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>
          <div className="sectionHead optionHead"><div><p className="sectionKicker">HUMANITÉS</p><h2>Nos options</h2></div></div>
          <div className="cards options">{options.map(([code,name]) => <article className="card option" key={code}><strong>{code}</strong><h3>{name}</h3><p>De la 1ère à la 4ème des Humanités</p></article>)}</div>
        </div>
      </section></Reveal>

      <Reveal><section id="action" className="section shell">
        <div className="sectionHead proofHead"><div><p className="sectionKicker">LE CAMPUS EN IMAGES</p><h2>Des espaces réels, un cadre d’apprentissage visible</h2><p>Découvrez les locaux de l’établissement à travers des photographies réelles de Riziki, optimisées uniquement pour la lumière, la netteté et la présentation Web.</p></div></div>
        <PhotoGallery photos={realPhotos} />
        <div className="sectionHead optionHead"><div><p className="sectionKicker">RIZIKI EN ACTION</p><h2>Nos élèves dans les ateliers techniques</h2><p>Électricité générale, mécanique générale et mécanique automobile : découvrez les élèves, les équipements et les activités pratiques à travers 31 nouvelles photographies authentiques.</p></div></div>
        <PhotoGallery photos={activityPhotos} />
        <div className="maternelleFeature">
          <div className="maternellePhoto"><Image src="/images/final/image-1791619633233.webp" alt="Salle de maternelle de EXCELLENCIA COLLÈGE RIZIKI" fill className="cover" sizes="(max-width: 800px) 100vw, 50vw" /></div>
          <div><p className="sectionKicker">FOCUS MATERNELLE</p><h3>Un environnement pensé pour les premiers apprentissages</h3><p>La maternelle dispose d’un espace identifiable et équipé, adapté aux activités d’éveil, d’initiation et d’accompagnement des plus petits.</p><span className="factBadge">1ère · 2ème · 3ème maternelle</span></div>
        </div>
        <div className="notice verifiedNotice"><strong>Authenticité des médias.</strong> Les images publiées sur le site proviennent exclusivement de l’établissement. Les futures photos des ateliers, pratiques et activités seront ajoutées au fur et à mesure de leur disponibilité.</div>
      </section></Reveal>

      <Reveal><section id="actualites" className="section soft">
        <div className="shell split">
          <div><p className="sectionKicker">ACTUALITÉS</p><h2>Les dernières nouvelles de Riziki</h2><PublicContent type="news" /></div>
          <div id="communiques"><p className="sectionKicker">COMMUNIQUÉS</p><h2>Informations aux parents</h2><PublicContent type="announcements" /></div>
        </div>
      </section></Reveal>

      <Reveal><section id="contact" className="section shell contactPremium">
        <div className="contactIntro"><p className="sectionKicker">CONTACT</p><h2>Choisissez votre façon de contacter l’école</h2><p>Pour s’adapter aux habitudes des familles, chaque service peut être joint directement par <strong>appel normal</strong>, par <strong>WhatsApp</strong> ou par le <strong>formulaire officiel du site</strong>.</p></div>
        <div className="channelStrip" aria-label="Canaux disponibles">
          <div><strong>☎ Appel</strong><span>Pour une réponse immédiate</span></div>
          <div><strong>◉ WhatsApp</strong><span>Pour un échange rapide</span></div>
          <div><strong>✎ Message officiel</strong><span>Pour une demande traçable</span></div>
        </div>
        <ServiceContacts />
      </section></Reveal>

      <Reveal><section id="message" className="section soft contactFormSection">
        <div className="shell formWrap">
          <div><p className="sectionKicker">MESSAGE</p><h2>Envoyer une demande à l’école</h2><p>Choisissez le service destinataire et envoyez une demande directement depuis le site. Les messages sont enregistrés dans l’espace d’administration dès que Supabase est configuré.</p></div>
          <ContactForm />
        </div>
      </section></Reveal>

      <section className="officialStrip"><div className="shell officialStripInner"><div><small>SITE OFFICIEL</small><strong>excellenciariziki.com</strong></div><p>Une seule adresse pour découvrir l’école, suivre ses actualités et contacter ses services.</p><a href="#accueil">Retour en haut ↑</a></div></section>
      <MobileContactDock />
      <footer className="footer"><div className="shell footerGrid"><div className="footerBrand"><Image src="/brand/logo-clean.png" alt="Logo Riziki" width={88} height={64}/><div><strong>EXCELLENCIA COLLÈGE RIZIKI</strong><p>Discipline · Travail · Excellence</p></div></div><div><strong>Adresse</strong><p>Avenue College Masombo n°23<br/>Quartier Hewa Bora, commune Kampempa</p></div><div><strong>Contact officiel</strong><p><a className="footerMail" href={`mailto:${SCHOOL.email}`}>{SCHOOL.email}</a><br/><a className="footerSite" href={SCHOOL.website}>excellenciariziki.com</a></p></div><div><strong>Réseaux officiels</strong><SocialLinks /></div></div><div className="copyright">© 2026 EXCELLENCIA COLLÈGE RIZIKI — Tous droits réservés.</div></footer>
    </main>
  );
}
