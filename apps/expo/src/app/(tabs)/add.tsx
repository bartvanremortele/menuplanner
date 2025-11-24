import React from "react";
import { useRouter } from "expo-router";

import AddRecipe from "~/components/add-recipe";

export default function AddScreen() {
  const router = useRouter();
  return <AddRecipe onBack={() => router.back()} />;
}
