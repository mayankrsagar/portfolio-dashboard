import { NextResponse } from "next/server";

import { getCache } from "@/lib/cache";
import { fetchCMPYahoo, fetchGoogleFinance } from "@/lib/scrapers";

import staticData from "../../data/portfolio.json";

interface Stock {
  nseCode: string;
  cmp?: number;
  pe?: number;
  latestEarnings?: number;
  [key: string]: string | number | undefined;
}

interface Sector {
  stocks: Stock[];
  [key: string]: unknown;
}

async function enrichSector(sector: Sector) {
  const stocks = await Promise.all(
    sector.stocks.map(async (st: Stock) => {
      const [cmp, { pe, earnings }] = await Promise.all([
        getCache(`cmp:${st.nseCode}`, () => fetchCMPYahoo(st.nseCode), 60_000),
        getCache(
          `google:${st.nseCode}`,
          () => fetchGoogleFinance(st.nseCode),
          60_000
        ),
      ]);

      return {
        ...st,
        cmp: cmp ?? st.cmp, // fallback to static
        pe: pe ?? st.pe,
        latestEarnings: earnings ?? st.latestEarnings,
      };
    })
  );
  return { ...sector, stocks };
}

export async function GET() {
  try {
    const live = await Promise.all(staticData.map(enrichSector));
    return NextResponse.json(live);
  } catch (err: unknown) {
    // graceful fallback
    console.error("Live scrape failed", err);
    return NextResponse.json(staticData);
  }
}
