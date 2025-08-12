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

export function ImageUpload({
  value,
  onChange,
  className,
  disabled,
  recipeId,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | undefined>(value);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const createImageUrl = useCreateRecipeImageUrl();

  // If value is an imageKey, construct the full URL
  React.useEffect(() => {
    if (value && !value.startsWith("http") && !value.startsWith("data:")) {
      const publicUrl = supabase.storage
        .from("recipe-images")
        .getPublicUrl(value).data.publicUrl;
      setPreview(publicUrl);
    } else {
      setPreview(value);
    }
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

      {preview ? (
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
            className="absolute right-2 top-2"
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
          className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload recipe image
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
