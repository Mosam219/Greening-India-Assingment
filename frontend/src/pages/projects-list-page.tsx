import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { CreateProjectCard } from "@/features/projects/projects-list/create-project-card";
import { ProjectsOverviewSection } from "@/features/projects/projects-list/projects-overview-section";
import { useProjectsListPage } from "@/features/projects/projects-list/use-projects-list-page";

export function ProjectsListPage() {
  const projectsPage = useProjectsListPage();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        eyebrow="Project Workspace"
        title="Projects"
        description="Review every project you can access, then add a new one without leaving the page. Loading, empty, and error states stay explicit."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant={projectsPage.isCreateOpen ? "secondary" : "default"}
              onClick={projectsPage.toggleCreateComposer}
            >
              <Plus className="size-4" />
              {projectsPage.isCreateOpen ? "Close composer" : "New project"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <CreateProjectCard
          isOpen={projectsPage.isCreateOpen}
          summaryLabel={projectsPage.projectSummaryLabel}
          submitError={projectsPage.submitError}
          isSubmitting={projectsPage.createProjectMutation.isPending}
          form={projectsPage.form}
          onSubmit={projectsPage.submitCreateProject}
          onCancel={projectsPage.closeCreateComposer}
        />

        <ProjectsOverviewSection
          projects={projectsPage.projects}
          currentUserId={projectsPage.user?.id}
          isLoading={projectsPage.projectsQuery.isLoading}
          isError={projectsPage.projectsQuery.isError}
          isRefreshing={projectsPage.projectsQuery.isFetching}
          onRetry={() => projectsPage.projectsQuery.refetch()}
          onCreate={projectsPage.openCreateComposer}
        />
      </div>
    </div>
  );
}
