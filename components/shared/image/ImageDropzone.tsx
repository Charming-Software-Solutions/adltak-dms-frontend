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
import { cn } from "@/lib/utils";
import { ImageUp, Pencil, XCircle } from "lucide-react";
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
  classname?: string;
};

const ImageDropzonePreview = ({
  file,
  onRemove,
}: ImageDropzonePreviewProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

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

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  return (
    <AspectRatio
      ratio={1 / 1}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {preview ? (
        <React.Fragment>
          <Image
            src={preview}
            alt="image-thumbnail"
            priority
            fill
            className="h-auto max-w-full rounded-sm object-cover transition-opacity duration-200"
          />
          {file instanceof File ? (
            <XCircle
              className="absolute top-2 right-2 p-1 text-red-500 cursor-pointer hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={onRemove}
            />
          ) : (
            <div
              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-sm transition-all duration-200 ${
                hover ? "bg-black/40" : "bg-transparent"
              }`}
            >
              {hover && (
                <Pencil
                  size={48}
                  color="white"
                  className="transition-opacity duration-200"
                />
              )}
            </div>
          )}
        </React.Fragment>
      ) : null}
    </AspectRatio>
  );
};

const ImageDropzone = (props: ImageDropzoneProps) => {
  const { control, name, label, classname } = props;
  const [file, setFile] = useState<File | string | undefined>(undefined);
  const [dropped, setDropped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        useEffect(() => {
          if (field.value) {
            setFile(field.value);
            setDropped(true);
          }
        }, [field.value]);

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
                  className={cn(
                    "dropzone bg-neutral-50 border border-dashed w-[10rem] h-full rounded-md flex items-center justify-center cursor-pointer p-0",
                    classname,
                  )}
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
