import { authRouter } from "./router/auth";
import { ingredientRouter } from "./router/ingredient";
import { labelRouter } from "./router/label";
import { recipeRouter } from "./router/recipe";
import { unitRouter } from "./router/unit";
import { uploadRouter } from "./router/upload";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  ingredient: ingredientRouter,
  label: labelRouter,
  recipe: recipeRouter,
  unit: unitRouter,
  upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
