"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { validateImage } from "@/lib/imageUtils";
import { ImageUp, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { DropZone, FileDropItem } from "react-aria-components";
import { Control } from "react-hook-form";
import { toast } from "sonner";

type ImageDropzonePreviewProps = {
  file: File | string | undefined;
  onRemove: (event: React.MouseEvent) => void;
};

type ImageDropzoneProps = {
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

const ImageDropzonePreview = ({
  file,
  onRemove,
}: ImageDropzonePreviewProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === "string") {
      setPreview(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <AspectRatio ratio={1 / 1}>
      {preview ? (
        <React.Fragment>
          <Image
            src={preview}
            alt="image-thumbnail"
            priority
            fill
            className="h-auto max-w-full rounded-sm"
          />
          <XCircle
            className="absolute top-0 right-0 p-1 text-red-500"
            onClick={onRemove}
          />
        </React.Fragment>
      ) : null}
    </AspectRatio>
  );
};

const ImageDropzone = (props: ImageDropzoneProps) => {
  const { control, name, label } = props;
  const [dropped, setDropped] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
          const selectedFile = event.target.files?.[0] || undefined;
          if (selectedFile) {
            validateImage(selectedFile, (isValid, errorMessage) => {
              if (isValid) {
                field.onChange(selectedFile);
                setFile(selectedFile);
                setDropped(true);
              } else {
                toast.error(errorMessage, { position: "top-center" });
              }
            });
          }
        };

        const handleRemoveImage = (event: React.MouseEvent) => {
          event.stopPropagation();
          field.onChange(undefined);
          setFile(undefined);
          setDropped(false);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        return (
          <FormItem className="flex h-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div onClick={() => fileInputRef.current?.click()}>
                <DropZone
                  className="dropzone bg-neutral-50 border border-dashed w-[10rem] h-full rounded-md flex items-center justify-center cursor-pointer p-0"
                  getDropOperation={(types) => {
                    return types.has("image/jpeg") ||
                      types.has("image/png") ||
                      types.has("image/gif")
                      ? "copy"
                      : "cancel";
                  }}
                  onDrop={(e) => {
                    const imageFile = e.items.find(
                      (item) =>
                        item.kind === "file" && item.type.startsWith("image/"),
                    ) as FileDropItem | undefined;

                    if (imageFile && imageFile.getFile) {
                      imageFile.getFile().then((fileItem) => {
                        validateImage(fileItem, (isValid, errorMessage) => {
                          if (isValid) {
                            field.onChange(fileItem);
                            setFile(fileItem);
                            setDropped(true);
                          } else {
                            toast.error(errorMessage, {
                              position: "top-center",
                            });
                          }
                        });
                      });
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {dropped ? (
                    <div className="flex w-[8.5rem] items-center justify-center">
                      <ImageDropzonePreview
                        file={file}
                        onRemove={handleRemoveImage}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <ImageUp className="size-8 text-neutral-300" />
                      <p className="text-sm text-neutral-400">Upload Image</p>
                    </div>
                  )}
                </DropZone>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ImageDropzone;
