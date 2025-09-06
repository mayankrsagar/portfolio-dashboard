"use client";

import { useState } from "react";

import { Sector } from "@/types";

import PortfolioTable from "./PortfolioTable";

type Props = { sectors: Sector[] };

export default function SectorGroup({ sectors }: Props) {
  return (
    <div className="space-y-4">
      {sectors.map((s) => (
        <SectorRow key={s.sector} sector={s} />
      ))}
    </div>
  );
}

function SectorRow({ sector }: { sector: Sector }) {
  const [open, setOpen] = useState(true);

  const totals = sector.stocks.reduce(
    (acc, st) => {
      const inv = st.purchasePrice * st.qty;
      const pv = st.cmp * st.qty;
      acc.investment += inv;
      acc.present += pv;
      acc.gain += pv - inv;
      return acc;
    },
    { investment: 0, present: 0, gain: 0 }
  );

  return (
    <div className="border rounded-lg shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition"
      >
        <span className="font-semibold">{sector.sector}</span>
        <span className="text-sm">
          {open ? "▲" : "▼"} &nbsp;
          <span
            className={totals.gain >= 0 ? "text-green-600" : "text-red-600"}
          >
            ₹{totals.gain.toLocaleString("en-IN")}
          </span>
        </span>
      </button>

      {open && (
        <div className="p-2">
          <div className="text-xs text-gray-600 mb-2">
            Investment ₹{totals.investment.toLocaleString("en-IN")} | Present ₹
            {totals.present.toLocaleString("en-IN")}
          </div>
          <PortfolioTable data={sector.stocks} />
        </div>
      )}
    </div>
  );
}
