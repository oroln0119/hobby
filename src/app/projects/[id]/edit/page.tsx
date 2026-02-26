'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockProjects } from '@/data/mock';
import type { Project } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import ProjectForm from '@/components/projects/ProjectForm';
import EmptyState from '@/components/ui/EmptyState';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const projectIndex = mockProjects.findIndex((p) => p.id === id);
  const project = mockProjects[projectIndex];

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader title="수정" showBack />
        <EmptyState title="프로젝트를 찾을 수 없어요" />
      </div>
    );
  }

  const handleSubmit = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    mockProjects[projectIndex] = {
      ...project,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    router.push(`/projects/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <PageHeader title="프로젝트 수정" showBack backHref={`/projects/${id}`} />
      <SafeAreaContainer>
        <ProjectForm initialData={project} onSubmit={handleSubmit} />
      </SafeAreaContainer>
    </div>
  );
}
