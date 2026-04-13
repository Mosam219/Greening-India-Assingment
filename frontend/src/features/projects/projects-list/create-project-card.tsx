import type { UseFormReturn } from "react-hook-form";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateProjectFormValues } from "@/features/projects/projects-schemas";

type CreateProjectCardProps = {
  isOpen: boolean;
  summaryLabel: string;
  submitError: string | null;
  isSubmitting: boolean;
  form: UseFormReturn<CreateProjectFormValues>;
  onSubmit: (values: CreateProjectFormValues) => Promise<void>;
  onCancel: () => void;
};

export function CreateProjectCard({
  isOpen,
  summaryLabel,
  submitError,
  isSubmitting,
  form,
  onSubmit,
  onCancel,
}: CreateProjectCardProps) {
  return (
    <SectionCard className="h-fit">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Create
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Add a new project
          </h2>
        </div>
        <div className="rounded-full border border-border/70 bg-background/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {summaryLabel}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        Start a new workspace with a clear name and optional description. The
        project appears immediately in the accessible list after a successful
        response.
      </p>

      {isOpen ? (
        <form
          className="mt-8 space-y-5"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="Website Redesign"
              aria-invalid={form.formState.errors.name ? "true" : "false"}
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Optional context for teammates and reviewers."
              aria-invalid={
                form.formState.errors.description ? "true" : "false"
              }
              {...form.register("description")}
            />
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="sm:min-w-44"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create project
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-border/80 bg-background/70 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Keep the first interaction focused
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Open the composer only when you need it, so the projects list
                keeps its scanability on mobile and desktop layouts.
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
