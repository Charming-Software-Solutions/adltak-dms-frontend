import { getCurrentUser } from "@/auth/currentUser";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProjects } from "@/lib/actions/project.actions";
import ProjectClient from "./ProjectClient";
import type { SearchParams } from "nuqs/server";
import { loadProjectSearchParams } from "@/lib/searchParams";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Projects({ searchParams }: Props) {
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
