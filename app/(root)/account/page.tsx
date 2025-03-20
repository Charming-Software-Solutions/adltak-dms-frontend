import { getCurrentUser } from "@/auth/currentUser";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return <AccountClient employee={employee!} />;
}
