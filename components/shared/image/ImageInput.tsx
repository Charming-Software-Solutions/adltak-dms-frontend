"use client";

import { validateImage } from "@/lib/imageUtils";
import { Upload } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";
import ImagePreview from "./ImagePreview";

type ImageInputProps = {
  mode: "create" | "edit";
  value: File | string | undefined;
  formReset: boolean;
  disabled: boolean;
  onChange: (file: File | undefined) => void;
};

const ImageInput = ({ ...props }: ImageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Fix image disappearing after pressing cancel in file manager

  useEffect(() => {
    if (props.formReset && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0] || undefined;
    if (file) {
      validateImage(file, (isValid, errorMessage) => {
        if (isValid) {
          props.onChange(file);
        } else {
          toast.error(errorMessage, { position: "top-center" });
        }
      });
    } else {
      props.onChange(undefined);
    }
  };

  const handleRemoveImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    props.onChange(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`h-full items-center justify-center cursor-pointer w-full image-dropzone-base 
      ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        disabled={props.disabled}
        onChange={handleFileChange}
      />
      {!props.value && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Upload />
          <span>Upload image</span>
        </div>
      )}
      <ImagePreview
        mode={props.mode}
        file={props.value}
        disabled={props.disabled}
        onRemove={(event) => handleRemoveImage(event)}
        type={"single"}
      />
    </div>
  );
};

export default ImageInput;
