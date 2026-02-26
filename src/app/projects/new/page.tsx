'use client';

import { useRouter } from 'next/navigation';
import { mockProjects } from '@/data/mock';
import type { Project } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import SafeAreaContainer from '@/components/layout/SafeAreaContainer';
import ProjectForm from '@/components/projects/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    router.push(`/projects/${newProject.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <PageHeader title="새 프로젝트" showBack backHref="/projects" />
      <SafeAreaContainer>
        <ProjectForm onSubmit={handleSubmit} />
      </SafeAreaContainer>
    </div>
  );
}
