import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

/* ---------- Yahoo Finance : CMP ---------- */
export async function fetchCMPYahoo(nseCode: string): Promise<number | null> {
  try {
    const url = `https://finance.yahoo.com/quote/${nseCode}.NS`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      cache: "no-store", // <-- add this
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const raw = $('fin-streamer[data-field="regularMarketPrice"]')
      .first()
      .text();
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

/* ---------- Google Finance : P/E & Latest Earnings ---------- */
export async function fetchGoogleFinance(
  nseCode: string
): Promise<{ pe: number | null; earnings: number | null }> {
  try {
    const url = `https://www.google.com/finance/quote/${nseCode}:NSE`;
    // const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      cache: "no-store", // <-- add this
    });
    if (!res.ok) return { pe: null, earnings: null };
    const html = await res.text();
    const $ = cheerio.load(html);

    // P/E is usually in a row with text "P/E ratio"
    const peText = $('div:contains("P/E ratio")')
      .last()
      .parent()
      .find("span")
      .last()
      .text()
      .replace(/,/g, "");
    const pe = peText ? Number(peText) : null;

    // Latest earnings (EPS TTM) – heuristic: look for "EPS" row
    const earningsText = $('div:contains("EPS")')
      .last()
      .parent()
      .find("span")
      .last()
      .text()
      .replace(/,/g, "");
    const earnings = earningsText ? Number(earningsText) : null;

    return { pe, earnings };
  } catch {
    return { pe: null, earnings: null };
  }
}
