'use client';
import { useState } from 'react';

export default function PasswordField({ label, name = 'password', minLength, autoComplete, required = true }: { label: string; name?: string; minLength?: number; autoComplete?: string; required?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <label>{label}<span className="passwordWrap"><input name={name} type={visible ? 'text' : 'password'} minLength={minLength} autoComplete={autoComplete} required={required}/><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={visible}><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{visible && <path d="M4 4l16 16"/>}</svg></button></span></label>;
}
