import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/features/auth";
import { createProject, getProjects } from "@/features/projects/projects-api";
import { projectsQueryKey } from "@/features/projects/query-keys";
import {
  createProjectFormSchema,
  type CreateProjectFormValues,
} from "@/features/projects/projects-schemas";
import { ApiClientError } from "@/lib/api-client";
import type { Project } from "@/types";

export function useProjectsListPage() {
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryKey = projectsQueryKey(user?.id);

  const projectsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication token is required to load projects.");
      }

      const response = await getProjects(token);
      return response.projects;
    },
    enabled: Boolean(token),
  });

  const createProjectMutation = useMutation({
    mutationFn: async (values: CreateProjectFormValues) => {
      if (!token) {
        throw new Error(
          "Authentication token is required to create a project.",
        );
      }

      return createProject(token, values);
    },
    onSuccess: async (project) => {
      queryClient.setQueryData<Project[] | undefined>(queryKey, (current) => [
        project,
        ...(current ?? []),
      ]);

      closeCreateComposer();

      await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });

  const projects = projectsQuery.data ?? [];
  const projectSummaryLabel = projectsQuery.isLoading
    ? "Loading projects..."
    : `${projects.length} accessible project${
        projects.length === 1 ? "" : "s"
      }`;

  async function submitCreateProject(values: CreateProjectFormValues) {
    setSubmitError(null);

    try {
      await createProjectMutation.mutateAsync(values);
    } catch (error) {
      if (
        error instanceof ApiClientError &&
        error.data?.error === "validation failed"
      ) {
        const nameMessage = error.data.fields.name;
        const descriptionMessage = error.data.fields.description;

        if (nameMessage) {
          form.setError("name", {
            type: "server",
            message: nameMessage,
          });
        }

        if (descriptionMessage) {
          form.setError("description", {
            type: "server",
            message: descriptionMessage,
          });
        }

        const fallbackMessage = Object.entries(error.data.fields).find(
          ([field]) => field !== "name" && field !== "description",
        )?.[1];

        setSubmitError(fallbackMessage ?? null);
        return;
      }

      setSubmitError(
        "Unable to create the project right now. Please try again.",
      );
    }
  }

  function openCreateComposer() {
    setSubmitError(null);
    setIsCreateOpen(true);
  }

  function toggleCreateComposer() {
    setSubmitError(null);
    setIsCreateOpen((current) => !current);
  }

  function closeCreateComposer() {
    form.reset();
    setSubmitError(null);
    setIsCreateOpen(false);
  }

  return {
    user,
    form,
    projects,
    isCreateOpen,
    submitError,
    projectSummaryLabel,
    projectsQuery,
    createProjectMutation,
    submitCreateProject,
    openCreateComposer,
    toggleCreateComposer,
    closeCreateComposer,
  };
}
