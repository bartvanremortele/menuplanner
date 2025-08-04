import { redirect } from "next/navigation";
import { getSession } from "@/auth/server";
import { paths } from "@/config/paths";

export default async function HomePage() {
  const session = await getSession();
  
  if (session) {
    redirect(paths.app.dashboard.getHref());
  } else {
    redirect(paths.auth.login.getHref());
  }
}
