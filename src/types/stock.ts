export interface StockQuote {
  c: number;   // precio actual
  d: number;   // cambio
  dp: number;  // cambio en %
  h: number;   // máximo del día
  l: number;   // mínimo del día
  o: number;   // precio de apertura
  pc: number;  // cierre anterior
  t: number;   // timestamp
}

export interface StockCandle {
  c: number[];  // precios de cierre
  h: number[];  // máximos
  l: number[];  // mínimos
  o: number[];  // aperturas
  s: string;    // status
  t: number[];  // timestamps
  v: number[];  // volumen
}

export interface CompanyProfile {
  country: string;
  currency: string;
  exchange: string;
  name: string;
  ticker: string;
  logo: string;
  marketCapitalization: number;
  shareOutstanding: number;
  weburl: string;
  ipo: string;
  finnhubIndustry: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
}

export type TimeInterval = "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";
