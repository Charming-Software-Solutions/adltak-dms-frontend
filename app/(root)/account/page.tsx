import { getAccountSession } from "@/lib/actions/auth.actions";
import AccountClient from "./AccountClient";

export default async function AccountPage() {
  const accountSession = await getAccountSession();

  return <AccountClient employee={accountSession.employee} />;
}
