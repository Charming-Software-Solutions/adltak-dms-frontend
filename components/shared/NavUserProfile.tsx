"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type NavUserProfileProps = {
  firstName: string;
  lastName: string;
  subtitle: string;
  alt: string;
  avatarImage?: string;
};

const NavUserProfile = ({
  firstName,
  lastName,
  subtitle,
  alt,
  avatarImage,
}: NavUserProfileProps) => {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="size-10 rounded-full">
        <AvatarImage src={avatarImage} alt={alt} />
        <AvatarFallback className="rounded-lg">{`${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{`${firstName} ${lastName}`}</span>
        <span className="truncate text-xs">{subtitle}</span>
      </div>
    </div>
  );
};

export default NavUserProfile;
