"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/auth/server";

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}

export async function signInWithGoogle() {
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
}