import { getCurrentUser } from "@/auth/currentUser";
import { getProducts } from "@/lib/actions/product.actions";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProjects } from "@/lib/actions/project.actions";
import ProjectClient from "./ProjectClient";

export default async function Distributions() {
  const brands = await getBrands();
  const projects = await getProjects();
  const products = await getProducts();
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return (
    <ProjectClient
      user={employee.user}
      employee={employee.first_name}
      projects={projects}
      brands={brands}
      products={products}
    />
  );
}
