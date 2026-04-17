Readme · MD
Copiar

# StockDash 📈
 
A real-time stock market dashboard built with Next.js, TypeScript and Tailwind CSS. Track your favorite stocks, analyze price trends, compare assets and stay on top of financial news — all in one place.
 
![StockDash](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-teal?style=flat-square&logo=tailwindcss)
![Finnhub](https://img.shields.io/badge/API-Finnhub-orange?style=flat-square)
 
## Features
 
- **Market Overview** — Real-time market indices (S&P 500, Nasdaq, Dow Jones, Russell 2000), watchlist summary with sparklines, top gainers/losers and latest market news
- **Watchlist** — Track your favorite stocks with live prices, 7-day sparklines and persistent storage
- **Price Charts** — Interactive candlestick and area charts with MA indicators (MA7, MA20, MA50, MA200) and volume
- **Stock Detail** — Full company profile, price chart, stats, latest news, AI prediction and ROI calculator per stock
- **Compare** — Side-by-side comparison of up to 4 stocks with combined chart and metrics table
- **Earnings Calendar** — Track upcoming and past earnings reports for your watchlist symbols
- **Financial News** — Market and company-specific news feed filtered by symbol
- **Price Alerts** — Set custom price alerts with above/below conditions and toast notifications
- **AI Prediction** — Technical analysis predictions using RSI, momentum, moving averages and volatility
- **ROI Calculator** — Calculate return on investment for any stock from any historical date
- **Settings** — Theme switcher, watchlist management and API status
## Tech Stack
 
- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + shadcn/ui
- **Charts** — TradingView Lightweight Charts
- **Data Fetching** — TanStack Query (React Query)
- **State Management** — Zustand (with persistence)
- **Market Data** — Finnhub API
- **Theme** — next-themes (dark/light mode)
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- A free [Finnhub API key](https://finnhub.io)
### Installation
 
1. Clone the repository:
```bash
git clone https://github.com/SaulVaz/stock-dashboard.git
cd stock-dashboard
```
 
2. Install dependencies:
```bash
npm install
```
 
3. Create a `.env.local` file in the root directory:
```env
FINNHUB_API_KEY=your_api_key_here
NEXT_PUBLIC_FINNHUB_WS_URL=wss://ws.finnhub.io
```
 
4. Run the development server:
```bash
npm run dev
```
 
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
## Project Structure
 
```
src/
├── app/
│   ├── (dashboard)/          # Dashboard pages with sidebar layout
│   │   ├── dashboard/        # Market Overview
│   │   ├── watchlist/        # Watchlist page
│   │   ├── compare/          # Stock comparison
│   │   ├── calendar/         # Earnings calendar
│   │   ├── news/             # Financial news
│   │   ├── settings/         # Settings
│   │   └── stock/[symbol]/   # Stock detail page
│   ├── (landing)/            # Landing page (no sidebar)
│   │   └── landing/
│   └── api/                  # API routes (server-side)
│       ├── stock/            # Stock data endpoints
│       ├── calendar/         # Earnings endpoints
│       └── news/             # News endpoints
├── components/
│   ├── layout/               # Sidebar, Header
│   ├── charts/               # PriceChart, ChartContainer
│   ├── watchlist/            # WatchlistCard, Sparkline
│   ├── stock/                # StockProfile, StockStats, ROICalculator
│   ├── compare/              # CompareChart, CompareTable
│   ├── alerts/               # AlertsBell, AlertsModal, AlertToast
│   ├── prediction/           # PredictionCard
│   ├── movers/               # TopMovers
│   ├── dashboard/            # MarketIndices, WatchlistSummary, RecentNews
│   ├── calendar/             # EconomicCalendar
│   ├── news/                 # NewsCard, NewsFeed
│   └── landing/              # Hero, Features, Footer
├── hooks/                    # React Query hooks
├── lib/                      # API client, utils, prediction model
├── store/                    # Zustand stores
└── types/                    # TypeScript interfaces
```
 
## API Routes
 
All Finnhub API calls are proxied through Next.js API routes to keep the API key secure on the server.
 
| Route | Description |
|-------|-------------|
| `GET /api/stock/quote/[symbol]` | Real-time stock quote |
| `GET /api/stock/candles/[symbol]` | Historical price data |
| `GET /api/stock/profile/[symbol]` | Company profile |
| `GET /api/stock/search` | Symbol search |
| `GET /api/stock/movers` | Top gainers and losers |
| `GET /api/stock/indices` | Market indices |
| `GET /api/calendar/earnings/[symbol]` | Earnings history |
| `GET /api/news/market` | Market news |
| `GET /api/news/company/[symbol]` | Company news |
 
## Environment Variables
 
| Variable | Description |
|----------|-------------|
| `FINNHUB_API_KEY` | Your Finnhub API key (required) |
| `NEXT_PUBLIC_FINNHUB_WS_URL` | Finnhub WebSocket URL |
 
## Notes
 
- Intraday intervals (1m, 5m, 15m, 30m, 1h) require a Finnhub paid plan
- Dividend data requires a Finnhub paid plan
- Free tier allows up to 60 API calls/minute
- Price alerts check every 30 seconds based on React Query's refetch interval
## License
 
MIT
Installation

Clone the repository:

bashgit clone https://github.com/SaulVaz/stock-dashboard.git
cd stock-dashboard

Install dependencies:

bashnpm install

Create a .env.local file in the root directory:

envFINNHUB_API_KEY=your_api_key_here
NEXT_PUBLIC_FINNHUB_WS_URL=wss://ws.finnhub.io

Run the development server:

bashnpm run dev

Open http://localhost:3000 in your browser.

Project Structure
src/
├── app/
│   ├── (dashboard)/          # Dashboard pages with sidebar layout
│   │   ├── dashboard/        # Market Overview
│   │   ├── watchlist/        # Watchlist page
│   │   ├── compare/          # Stock comparison
│   │   ├── calendar/         # Earnings calendar
│   │   ├── news/             # Financial news
│   │   ├── settings/         # Settings
│   │   └── stock/[symbol]/   # Stock detail page
│   ├── (landing)/            # Landing page (no sidebar)
│   │   └── landing/
│   └── api/                  # API routes (server-side)
│       ├── stock/            # Stock data endpoints
│       ├── calendar/         # Earnings endpoints
│       └── news/             # News endpoints
├── components/
│   ├── layout/               # Sidebar, Header
│   ├── charts/               # PriceChart, ChartContainer
│   ├── watchlist/            # WatchlistCard, Sparkline
│   ├── stock/                # StockProfile, StockStats, ROICalculator
│   ├── compare/              # CompareChart, CompareTable
│   ├── alerts/               # AlertsBell, AlertsModal, AlertToast
│   ├── prediction/           # PredictionCard
│   ├── movers/               # TopMovers
│   ├── dashboard/            # MarketIndices, WatchlistSummary, RecentNews
│   ├── calendar/             # EconomicCalendar
│   ├── news/                 # NewsCard, NewsFeed
│   └── landing/              # Hero, Features, Footer
├── hooks/                    # React Query hooks
├── lib/                      # API client, utils, prediction model
├── store/                    # Zustand stores
└── types/                    # TypeScript interfaces
API Routes
All Finnhub API calls are proxied through Next.js API routes to keep the API key secure on the server.
RouteDescriptionGET /api/stock/quote/[symbol]Real-time stock quoteGET /api/stock/candles/[symbol]Historical price dataGET /api/stock/profile/[symbol]Company profileGET /api/stock/searchSymbol searchGET /api/stock/moversTop gainers and losersGET /api/stock/indicesMarket indicesGET /api/calendar/earnings/[symbol]Earnings historyGET /api/news/marketMarket newsGET /api/news/company/[symbol]Company news
Environment Variables
VariableDescriptionFINNHUB_API_KEYYour Finnhub API key (required)NEXT_PUBLIC_FINNHUB_WS_URLFinnhub WebSocket URL
Notes

Intraday intervals (1m, 5m, 15m, 30m, 1h) require a Finnhub paid plan
Dividend data requires a Finnhub paid plan
Free tier allows up to 60 API calls/minute
Price alerts check every 30 seconds based on React Query's refetch interval

License
MIT
