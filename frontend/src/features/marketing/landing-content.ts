import { CircleCheckBig, Clock3, FolderKanban, UserRound } from "lucide-react";

export const valueCards = [
  {
    title: "Create projects that stay clear",
    description:
      "Keep every project in one place with a simple structure your team can understand at a glance.",
    icon: FolderKanban,
  },
  {
    title: "Assign work with context",
    description:
      "Give each task an owner, priority, and due date so the next step is always obvious.",
    icon: UserRound,
  },
  {
    title: "Track progress without friction",
    description:
      "Move work between stages in seconds and keep everyone aligned on what is done and what is blocked.",
    icon: CircleCheckBig,
  },
];

export const workflowSteps = [
  {
    step: "01",
    title: "Start a workspace",
    description:
      "Create a project for a launch, redesign, campaign, or any workstream that needs structure.",
  },
  {
    step: "02",
    title: "Capture the work",
    description:
      "Add tasks with priority, assignee, and due date so details do not disappear in chat.",
  },
  {
    step: "03",
    title: "Keep momentum visible",
    description:
      "Filter, review, and update statuses as work moves from planned to in progress to done.",
  },
];

export const previewColumns = [
  {
    title: "To do",
    tasks: [
      { title: "Draft campaign brief", owner: "Taylor", tag: "High" },
      { title: "Confirm launch timeline", owner: "Jamie", tag: "Today" },
    ],
  },
  {
    title: "In progress",
    tasks: [
      { title: "Design onboarding screen", owner: "Alex", tag: "Active" },
      { title: "Review homepage copy", owner: "Taylor", tag: "Review" },
    ],
  },
  {
    title: "Done",
    tasks: [
      { title: "Create stakeholder list", owner: "Jamie", tag: "Done" },
      { title: "Set project priorities", owner: "Alex", tag: "Done" },
    ],
  },
];

export const workflowBenefits = [
  {
    title: "Faster weekly check-ins",
    description: "See what moved, what is blocked, and what needs a decision.",
    icon: Clock3,
    toneClassName: "bg-primary/12 text-primary",
  },
  {
    title: "Cleaner handoffs",
    description:
      "Ownership, due dates, and status updates stay attached to the work.",
    icon: CircleCheckBig,
    toneClassName: "bg-accent text-accent-foreground",
  },
];
