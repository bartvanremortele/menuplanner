import type { TRPCRouterRecord } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod/v4";

import { adminProcedure } from "../../trpc";

// Create Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const uploadRouter = {
  createRecipeImageUrl: adminProcedure
    .input(
      z.object({
        recipeId: z.string().uuid(),
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { recipeId, contentType } = input;

      // Use recipe ID as both folder and filename for easy management
      const fileExt = contentType.split("/").pop() ?? "jpg";
      const fileName = `${recipeId}/${recipeId}.${fileExt}`;

      // Create a signed URL for uploading
      const { data, error } = await supabase.storage
        .from("recipe-images")
        .createSignedUploadUrl(fileName);

      if (error) {
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      return {
        uploadUrl: data.signedUrl,
        path: fileName,
        token: data.token,
      };
    }),
} satisfies TRPCRouterRecord;
