"use client";

import Header from "@/components/shared/Header";
import { visibileDistributionProductColumns } from "@/components/shared/table/columns/DistributionProductColumns";
import { DataTable } from "@/components/shared/table/data-table";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const DistributionCreateClient = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>test</Header>

      {isMounted ? (
        <DataTable
          columns={
            isDesktop
              ? visibileDistributionProductColumns.desktop
              : visibileDistributionProductColumns.mobile
          }
          data={[]}
        />
      ) : null}

      <main className="main-container"></main>
    </React.Fragment>
  );
};

export default DistributionCreateClient;
