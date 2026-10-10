'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export type PhotoItem = { src: string; alt: string; title: string; tag?: string };

export default function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [active, setActive] = useState<PhotoItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div className="photoMosaic">
        {photos.map((photo, index) => (
          <button
            type="button"
            className={`photoTile ${index === 0 || index === 5 ? 'photoTileWide' : ''}`}
            key={photo.src}
            onClick={() => setActive(photo)}
            aria-label={`Agrandir : ${photo.title}`}
          >
            <Image src={photo.src} alt={photo.alt} fill className="cover" sizes="(max-width: 700px) 100vw, 50vw" />
            <span className="photoOverlay">
              {photo.tag && <small>{photo.tag}</small>}
              <strong>{photo.title}</strong>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <button className="lightboxClose" type="button" onClick={() => setActive(null)} aria-label="Fermer l’image">×</button>
          <div className="lightboxFrame" onClick={(event) => event.stopPropagation()}>
            <Image src={active.src} alt={active.alt} fill className="contain" sizes="95vw" priority />
          </div>
          <div className="lightboxCaption"><strong>{active.title}</strong><span>{active.alt}</span></div>
        </div>
      )}
    </>
  );
}
