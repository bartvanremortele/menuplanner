import { redirect } from "next/navigation";
import { Button } from "~/ui/button";
import { auth, getSession } from "~/auth/server";

export default async function LoginPage() {
  // Check if already authenticated
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="container flex h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Menu <span className="text-primary">Planner</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Sign in to manage your recipes and meal plans
          </p>
        </div>

        <form className="w-full">
          <Button
            size="lg"
            className="w-full"
            formAction={async () => {
              "use server";
              const res = await auth.api.signInSocial({
                body: {
                  provider: "google",
                  callbackURL: "/",
                },
              });
              if (!res.url) {
                throw new Error("No URL returned from signInSocial");
              }
              redirect(res.url);
            }}
          >
            Sign in with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}