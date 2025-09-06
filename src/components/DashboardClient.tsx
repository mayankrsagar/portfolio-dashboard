"use client";

import { usePortfolio } from "@/lib/usePortfolio";
import { Sector } from "@/types";

import SectorGroup from "./SectorGroup";

export default function DashboardClient({ initial }: { initial: Sector[] }) {
  const { sectors, error, isLoading } = usePortfolio();

  // SWR hydrates with `initial` on mount, then refreshes every 15 min
  const data = sectors.length ? sectors : initial;

  if (error)
    return <div className="text-red-600">Failed to load portfolio</div>;
  if (isLoading && !data.length) return <div>Loading…</div>;

  return <SectorGroup sectors={data} />;
}
