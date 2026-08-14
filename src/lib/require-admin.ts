import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error("UNAUTHORIZED_ADMIN_ACTION");
  }

  return session;
}
