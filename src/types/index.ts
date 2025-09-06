export type Stock = {
  name: string;
  purchasePrice: number;
  qty: number;
  nseCode: string;
  cmp: number;
  pe: number;
  latestEarnings: number;
};

export type Sector = {
  sector: string;
  stocks: Stock[];
};
