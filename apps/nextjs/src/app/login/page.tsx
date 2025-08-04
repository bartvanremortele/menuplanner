import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/auth/server";
import { paths } from "@/config/paths";

export default async function Page() {
  const session = await getSession();
  
  if (session) {
    redirect(paths.app.dashboard.getHref());
  }
  
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
