"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth/server";
import { paths } from "@/config/paths";

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect(paths.home.getHref());
}

export async function signInWithGoogle() {
  const res = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: paths.home.getHref(),
    },
  });
  if (!res.url) {
    throw new Error("No URL returned from signInSocial");
  }
  redirect(res.url);
}
