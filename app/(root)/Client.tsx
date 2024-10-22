"use client";

import ChartCard from "@/components/shared/charts/ChartCard";
import Header from "@/components/shared/Header";
import { SegmentedProgress } from "@/components/ui/segmented-progress";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/user";
import React from "react";

const stockData = { available: 500, lowStock: 100, outOfStock: 50 };

const colors = {
  available: "bg-green-500",
  lowStock: "bg-amber-500",
  outOfStock: "bg-red-500",
};

const totalStock =
  stockData.available + stockData.lowStock + stockData.outOfStock;
const segments = [
  {
    value: (stockData.available / totalStock) * 100,
    color: colors.available,
    label: "Available",
  },
  {
    value: (stockData.lowStock / totalStock) * 100,
    color: colors.lowStock,
    label: "Low Stock",
  },
  {
    value: (stockData.outOfStock / totalStock) * 100,
    color: colors.outOfStock,
    label: "Out of Stock",
  },
];

type Props = {
  user: User;
};

const HomeClient = ({ user }: Props) => {
  return (
    <React.Fragment>
      <Header user={user}>
        <h1>test</h1>
      </Header>
      <main className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 p-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <ChartCard title="Shipping Performance">
              <div className="mt-2"></div>
            </ChartCard>
            <ChartCard title="Stock Availability">
              <div className="mt-2">
                <div className="flex flex-col">
                  <h4 className="text-2xl font-bold">1500</h4>
                  <p className="mt-[0.1rem] text-gray-500 text-sm">
                    Total Stock
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex flex-row mb-4 gap-4 items-center justify-between">
                    {segments.map((segment, key) => (
                      <div className="flex items-center">
                        <div
                          key={key}
                          className={`size-4 rounded-[4px] ${segment.color}`}
                        ></div>
                        <p className="ml-2 font-medium text-sm">
                          {segment.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <SegmentedProgress
                    segments={segments}
                    className="mb-4 rounded-[5px]"
                  />
                  <Separator />
                  <div className="flex flex-col mt-4">
                    <p className="text-slate-500 text-sm font-medium">
                      Low Stock
                    </p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-[4px] h-[14px] rounded-md bg-amber-500"></div>
                        <p className="ml-1.5">Piattos</p>
                      </div>
                      <p>10</p>
                      <p>Jack and Jill</p>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
          <ChartCard title="Shipping Tracking">
            <div className="h-40">{/* Placeholder for tracking content */}</div>
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <ChartCard title="Customer Satisfaction">
            <div className="h-40">
              {/* Placeholder for satisfaction content */}
            </div>
          </ChartCard>
          <ChartCard title="Logistics Team">
            <div className="h-20">{/* Placeholder for team content */}</div>
          </ChartCard>
        </div>
      </main>
    </React.Fragment>
  );
};

export default HomeClient;
