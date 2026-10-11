'use client';

import { useEffect, useState } from 'react';
import { SCHOOL, SERVICES, type SchoolService } from '@/lib/config';
import { hasSupabase, supabase } from '@/lib/supabase-browser';

export type SiteSettings = typeof SCHOOL;
export type DynamicService = SchoolService & { whatsapp?: string | null; photo_url?: string | null; active?: boolean; sort_order?: number };

export function useSiteSettings() {
  const [settings, setSettings] = useState(SCHOOL);
  useEffect(() => {
    if (!hasSupabase) return;
    supabase.from('site_settings').select('school_name,motto,address,email,website').eq('id', true).maybeSingle().then(({ data }) => {
      if (!data) return;
      setSettings({ ...SCHOOL, name: data.school_name, motto: data.motto, address: data.address, email: data.email, website: data.website });
    });
  }, []);
  return settings;
}

export function useSchoolServices() {
  const [services, setServices] = useState<DynamicService[]>(SERVICES.map((item, index) => ({ ...item, sort_order: index })));
  useEffect(() => {
    if (!hasSupabase) return;
    supabase.from('school_services').select('id,label,person_name,phone,whatsapp,alternate_phone,photo_url,active,sort_order').eq('active', true).order('sort_order').then(({ data }) => {
      if (!data?.length) return;
      setServices(data.map(item => ({
        id: item.id,
        label: item.label,
        person: item.person_name,
        phone: item.phone,
        whatsapp: item.whatsapp,
        photo_url: item.photo_url,
        alternatePhones: item.alternate_phone ? [item.alternate_phone] : [],
        active: item.active,
        sort_order: item.sort_order,
      })));
    });
  }, []);
  return services;
}
