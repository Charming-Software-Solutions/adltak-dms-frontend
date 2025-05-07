import { getCurrentUser } from "@/auth/currentUser";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProjects } from "@/lib/actions/project.actions";
import ProjectClient from "./ProjectClient";
import type { SearchParams } from "nuqs/server";
import { loadProjectSearchParams } from "@/lib/searchParams";
import { Suspense } from "react";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";

type Props = {
  searchParams: Promise<SearchParams>;
};

async function ProjectsServer({ searchParams }: Props) {
  const brands = await getBrands();
  const projects = await getProjects(
    await loadProjectSearchParams(searchParams),
  );
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return (
    <ProjectClient
      user={employee.user}
      employee={employee.first_name}
      projects={projects}
      brands={brands}
    />
  );
}

export default function ProjectsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <ProjectsServer searchParams={searchParams} />
    </Suspense>
  );
}
