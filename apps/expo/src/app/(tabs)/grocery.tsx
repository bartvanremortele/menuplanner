import React from "react";
import { useRouter } from "expo-router";

import GroceryList from "~/components/grocery-list";

export default function GroceryScreen() {
  const router = useRouter();
  return <GroceryList onBack={() => router.back()} />;
}
