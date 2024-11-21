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
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0]?.charAt(0).toUpperCase();
    const lastNameInitial = nameParts[1]?.charAt(0).toUpperCase();
    return firstNameInitial + (lastNameInitial ? lastNameInitial : "");
  };

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="size-10 rounded-full">
        <AvatarImage src={avatarImage} alt={alt} />
        <AvatarFallback className="rounded-lg">
          {getInitials(title)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{title}</span>
        <span className="truncate text-xs">{subtitle}</span>
      </div>
    </div>
  );
};

export default NavUserProfile;
