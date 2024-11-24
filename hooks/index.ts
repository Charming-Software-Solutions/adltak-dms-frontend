"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Breakpoint = "mobile" | "tablet" | "desktop" | "large";

export function useResponsive(breakpoint: Breakpoint): boolean {
  const queries = {
    mobile: { maxWidth: 767 },
    tablet: { minWidth: 768, maxWidth: 1223 },
    desktop: { minWidth: 1224, maxWidth: 1823 },
    large: { minWidth: 1824 },
  };

  return useMediaQuery(queries[breakpoint]);
}

export function useDialog(): {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
} {
  const [openDialog, setOpenDialog] = useState(false);
  return { openDialog, setOpenDialog };
}
