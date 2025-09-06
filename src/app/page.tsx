// import SectorGroup from '@/components/SectorGroup';
import SectorGroup from "@/components/SectorGroup";
import { Sector } from "@/types";

async function getPortfolio(): Promise<Sector[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/portfolio`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

export default async function Home() {
  const sectors = await getPortfolio();

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Portfolio Dashboard</h1>
      <SectorGroup sectors={sectors} />
    </main>
  );
}
