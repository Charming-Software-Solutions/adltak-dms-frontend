"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type NavUserProfileProps = {
  title: string;
  subtitle: string;
  alt: string;
  avatarImage?: string;
};

const NavUserProfile = ({
  title,
  subtitle,
  alt,
  avatarImage,
}: NavUserProfileProps) => {
  const imageSrc = avatarImage || "/assets/images/default-avatar.jpg";

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="size-10 rounded-full">
        <AvatarImage src={imageSrc} alt={alt} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{title}</span>
        <span className="truncate text-xs">{subtitle}</span>
      </div>
    </div>
  );
};

export default NavUserProfile;
