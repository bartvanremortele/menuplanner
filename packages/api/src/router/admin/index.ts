import { createTRPCRouter } from "../../trpc";
import { ingredientRouter } from "./ingredient";
import { labelRouter } from "./label";
import { recipeRouter } from "./recipe";
import { unitRouter } from "./unit";
import { uploadRouter } from "./upload";

/**
 * Admin router - groups all admin routes
 *
 * These routes are for the admin dashboard (Next.js app)
 * and handle recipe management, ingredient management, etc.
 */
export const adminRouter = createTRPCRouter({
  ingredient: ingredientRouter,
  label: labelRouter,
  recipe: recipeRouter,
  unit: unitRouter,
  upload: uploadRouter,
});
