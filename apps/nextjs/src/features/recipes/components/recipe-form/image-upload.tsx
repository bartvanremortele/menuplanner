"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRecipeImageUrl } from "@/features/recipes/api/use-upload";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
  disabled?: boolean;
  recipeId?: string;
}

function isValidImageUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    // Check if it's a data URI
    if (url.startsWith("data:image/")) return true;
    // Check if it's a valid HTTP(S) URL
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

export function ImageUpload({
  value,
  onChange,
  className,
  disabled,
  recipeId,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | undefined>();
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const createImageUrl = useCreateRecipeImageUrl();

  // If value is an imageKey, construct the full URL
  React.useEffect(() => {
    if (!value) {
      setPreview(undefined);
      return;
    }

    // If it's already a valid URL or data URI, use it directly
    if (value.startsWith("http") || value.startsWith("data:")) {
      setPreview(value);
      return;
    }

    // Otherwise, assume it's a storage path and construct the URL
    const publicUrl = supabase.storage.from("recipe-images").getPublicUrl(value)
      .data.publicUrl;
    setPreview(publicUrl);
  }, [value]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For new recipes, generate a temporary ID
    const uploadRecipeId = recipeId ?? crypto.randomUUID();

    setIsUploading(true);

    try {
      // Get signed upload URL from server
      const { uploadUrl, path } = await createImageUrl.mutateAsync({
        recipeId: uploadRecipeId,
        contentType: file.type,
      });

      // Upload directly to Supabase Storage using the signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Get the public URL for preview
      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(path);

      setPreview(publicUrl);
      onChange(path); // Store the path, not the full URL
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {isValidImageUrl(preview) ? (
        <div className="relative">
          <Image
            src={preview}
            alt="Recipe preview"
            width={800}
            height={256}
            className="h-64 w-full rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled === true || isUploading === true}
          className="border-muted-foreground/25 hover:border-muted-foreground/50 flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="text-muted-foreground h-10 w-10" />
              <span className="text-muted-foreground text-sm">
                Click to upload recipe image
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
