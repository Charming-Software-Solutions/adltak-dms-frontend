"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { validateImage } from "@/lib/imageUtils";
import { Pencil, XCircle } from "lucide-react";
import NextImage from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type ImagePreviewProps = {
  file: File | string | undefined;
  mode: "create" | "edit";
  type: "single" | "multi";
  disabled: boolean;
  onRemove: (event: React.MouseEvent) => void;
};

const ImagePreview = ({ ...props }: ImagePreviewProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (props.file instanceof File) {
      validateImage(props.file, (isValid, errorMessage) => {
        if (isValid && props.file instanceof File) {
          const objectUrl = URL.createObjectURL(props.file);
          setPreview(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        } else {
          toast.error(errorMessage, { position: "top-center" });
        }
      });
    } else if (typeof props.file === "string") {
      setPreview(props.file);
    } else {
      setPreview(null);
    }
  }, [props.file]);

  // Handle image load to get the natural dimensions
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const handleMouseEnter = () => {
    if (props.mode === "edit" && !props.disabled) {
      setHover(true);
    }
  };

  const handleMouseLeave = () => {
    if (props.mode === "edit" && !props.disabled) {
      setHover(false);
    }
  };

  return (
    preview && (
      <div
        className={`p-1 ${
          props.type === "single"
            ? "w-[100px]"
            : props.mode === "create"
              ? "w-[90px]"
              : "w-[120px]"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AspectRatio ratio={aspectRatio || 4 / 3}>
          <NextImage
            src={preview}
            alt="Preview"
            className="h-auto max-w-full rounded-sm"
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={handleImageLoad}
          />
          {props.mode === "edit" && props.type === "single" && hover && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 rounded-md pointer-events-none">
              <Pencil size={48} color="white" />
            </div>
          )}
          {(props.mode === "create" ||
            (props.mode === "edit" && props.type === "multi")) && (
            <XCircle
              className="absolute top-0 right-0 p-1 text-red-500"
              onClick={props.onRemove}
              size={props.type === "single" ? 25 : 22}
            />
          )}
        </AspectRatio>
      </div>
    )
  );
};

export default ImagePreview;
