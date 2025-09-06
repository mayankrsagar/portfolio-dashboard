"use client";

import { Stock } from "@/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<Stock>();

const columns = [
  columnHelper.accessor("name", { header: "Stock" }),
  columnHelper.accessor("purchasePrice", { header: "Purchase" }),
  columnHelper.accessor("qty", { header: "Qty" }),
  columnHelper.accessor((row) => row.purchasePrice * row.qty, {
    id: "investment",
    header: "Investment",
    cell: (info) => `₹${info.getValue().toLocaleString("en-IN")}`,
  }),
  columnHelper.accessor("cmp", { header: "CMP" }),
  columnHelper.accessor((row) => row.cmp * row.qty, {
    id: "presentValue",
    header: "Present Value",
    cell: (info) => `₹${info.getValue().toLocaleString("en-IN")}`,
  }),
  columnHelper.accessor(
    (row) => row.cmp * row.qty - row.purchasePrice * row.qty,
    {
      id: "gainLoss",
      header: "Gain/Loss",
      cell: (info) => {
        const val = info.getValue();
        return (
          <span className={val >= 0 ? "text-green-600" : "text-red-600"}>
            ₹{val.toLocaleString("en-IN")}
          </span>
        );
      },
    }
  ),
  columnHelper.accessor("pe", { header: "P/E" }),
  columnHelper.accessor("latestEarnings", { header: "Latest Earnings" }),
];

export default function PortfolioTable({ data }: { data: Stock[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="min-w-full text-sm">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id} className="border-b">
            {hg.headers.map((h) => (
              <th key={h.id} className="px-2 py-2 text-left">
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-2 py-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
