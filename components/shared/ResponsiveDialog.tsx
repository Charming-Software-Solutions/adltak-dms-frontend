"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

type ResponsiveDialogBaseProps = {
  children: React.ReactNode;
  className?: string;
};

const ResponsiveDialogTrigger = ({
  children,
  className,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogTrigger asChild className={className}>
      {children}
    </DialogTrigger>
  ) : (
    <DrawerTrigger asChild className={className}>
      {children}
    </DrawerTrigger>
  );
};

const ResponsiveDialogHeader = ({
  className,
  children,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogHeader className={className}>{children}</DialogHeader>
  ) : (
    <DrawerHeader className={cn("text-left", className)}>
      {children}
    </DrawerHeader>
  );
};

const ResponsiveDialogTitle = ({
  children,
  className,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogTitle className={className}>{children}</DialogTitle>
  ) : (
    <DrawerTitle className={className}>{children}</DrawerTitle>
  );
};

const ResponsiveDialogDescription = ({
  children,
  className,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogDescription className={className}>{children}</DialogDescription>
  ) : (
    <DrawerDescription className={className}>{children}</DrawerDescription>
  );
};

const ResponsiveDialogContent = ({
  children,
  className,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogContent className={cn("max-w-lg", className)}>
      {children}
    </DialogContent>
  ) : (
    <DrawerContent>{children}</DrawerContent>
  );
};

const ResponsiveDialogFooter = ({
  children,
  className,
}: ResponsiveDialogBaseProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  return isDesktop ? (
    <DialogFooter className={className}>{children}</DialogFooter>
  ) : (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  );
};

type ResponsiveDialogProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/* Structure
 *
 * <ResponsiveDialog>
 *  <ResponsiveDialogTrigger>{trigger}</ResponsiveDialogTrigger>
 *  <ResponsiveDialogContent>
 *    <ResponsiveDialogHeader>
 *      <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
 *      <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
 *    <ResponsiveDialogHeader>
 *    {content}
 *    <ResponsiveDialogFooter>{footer}</ResponsiveDialogFooter>
 *  </ResponsiveDialogContent
 * </ResponsiveDialog>
 * */

const ResponsiveDialog = ({
  children,
  open,
  setOpen,
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
    </Drawer>
  );
};

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
