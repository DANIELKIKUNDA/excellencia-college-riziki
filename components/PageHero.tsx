import Image from 'next/image';

export default function PageHero({kicker,title,text,image}:{kicker:string;title:string;text:string;image:string}){return <section className="pageHero"><Image src={image} alt="EXCELLENCIA COLLÈGE RIZIKI" fill priority className="cover"/><div className="heroShade"/><div className="shell pageHeroContent"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{text}</p></div></section>}
