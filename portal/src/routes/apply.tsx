import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LEVELS, type Level } from "@/lib/catalog";

type Search = { level?: Level };

export const Route = createFileRoute("/apply")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const level = typeof s.level === "string" && LEVELS.includes(s.level as Level)
      ? (s.level as Level)
      : undefined;
    return { level };
  },
  component: ApplyRedirect,
});

function ApplyRedirect() {
  const { level } = Route.useSearch();
  return <Navigate to="/" search={level ? { level } : {}} />;
}
