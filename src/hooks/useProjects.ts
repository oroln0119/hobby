'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Project, ProjectStatus, ProjectType, ToolReference, Gauge } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('프로젝트 fetch 오류:', error.message);
        setLoading(false);
        return;
      }

      const mapped: Project[] = (data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji ?? undefined,
        status: p.status as ProjectStatus,
        type: p.type as ProjectType,
        brand: p.brand ?? undefined,
        startDate: p.start_date ?? undefined,
        endDate: p.end_date ?? undefined,
        size: p.size ?? undefined,
        yarn: p.yarn ?? undefined,
        thumbnailUrl: p.thumbnail_url ?? undefined,
        notes: p.notes ?? undefined,
        url: p.url ?? undefined,
        patternGauge: (p.pattern_gauge as Gauge) ?? undefined,
        myGauge: (p.my_gauge as Gauge) ?? undefined,
        patternTools: (p.pattern_tools as ToolReference[]) ?? [],
        myTools: (p.my_tools as ToolReference[]) ?? [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      setProjects(mapped);
      setLoading(false);
    }

    fetchProjects();
  }, []);

  return { projects, loading };
}
