import React from "react";
import Image from "next/image";
import { imagePlaceholder } from "@/constants";

type TableImageProps = {
  alt: string;
  src: string;
};

const TableImage = ({ alt, src }: TableImageProps) => {
  return (
    <Image
      alt={alt}
      priority
      className="aspect-square rounded-md object-cover"
      height={58}
      width={58}
      src={src ?? imagePlaceholder}
    />
  );
};

export default TableImage;
