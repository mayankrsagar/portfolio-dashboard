import useSWR from "swr";

import { Sector } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePortfolio() {
  const { data, error, isLoading, mutate } = useSWR<Sector[]>(
    "/api/portfolio",
    fetcher,
    {
      refreshInterval: 900_000, // 15 min
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  return { sectors: data ?? [], error, isLoading, mutate };
}
