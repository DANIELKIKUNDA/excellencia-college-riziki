'use client';

import { SERVICES } from '@/lib/config';

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `243${digits.slice(1)}` : digits;
}

function waHref(service: string, phone: string) {
  const text = encodeURIComponent(`Bonjour ${service}, je vous contacte depuis le site officiel de EXCELLENCIA COLLÈGE RIZIKI.`);
  return `https://wa.me/${whatsappNumber(phone)}?text=${text}`;
}

export default function ServiceContacts() {
  return (
    <div className="serviceContacts">
      {SERVICES.map((service) => {
        const phone = service.phone;
        return (
          <article className="serviceContactCard" key={service.id}>
            <div className="serviceContactHead">
              <span className="serviceIcon" aria-hidden="true">{service.label.charAt(0)}</span>
              <div>
                <h3>{service.label}</h3>
                <p>{phone ?? 'Numéro à ajouter'}</p>
              </div>
            </div>
            <div className="serviceActions">
              {phone ? <>
                <a className="serviceAction call" href={`tel:${phone}`} aria-label={`Appeler ${service.label}`}>
                  <span aria-hidden="true">☎</span> Appeler
                </a>
                <a className="serviceAction whatsapp" href={waHref(service.label, phone)} target="_blank" rel="noreferrer" aria-label={`Écrire à ${service.label} sur WhatsApp`}>
                  <span aria-hidden="true">◉</span> WhatsApp
                </a>
              </> : <span className="servicePending">Contact bientôt disponible</span>}
              <a className="serviceAction write" href={`#message?service=${service.id}`} onClick={() => {
                const select = document.querySelector<HTMLSelectElement>('select[name="service"]');
                if (select) {
                  select.value = service.id;
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setTimeout(() => document.getElementById('message')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
              }}>
                <span aria-hidden="true">✎</span> Écrire
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
