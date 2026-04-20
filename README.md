# StockDash 📈

Dashboard de mercado de valores en tiempo real construido con Next.js, TypeScript y Tailwind CSS. Rastrea tus acciones favoritas, analiza tendencias de precios, compara activos y mantente al día con las noticias financieras — todo en un solo lugar.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-teal?style=flat-square&logo=tailwindcss)
![Finnhub](https://img.shields.io/badge/API-Finnhub-orange?style=flat-square)

## Funcionalidades

- **Market Overview** — Índices del mercado en tiempo real (S&P 500, Nasdaq, Dow Jones, Russell 2000), resumen de watchlist con sparklines, top gainers/losers y últimas noticias del mercado
- **Watchlist** — Rastrea tus acciones favoritas con precios en vivo, sparklines de 7 días y almacenamiento persistente
- **Gráficas de precios** — Gráficas interactivas de velas y área con indicadores MA (MA7, MA20, MA50, MA200) y volumen
- **Detalle de acción** — Perfil completo de la empresa, gráfica de precios, estadísticas, últimas noticias, predicción con IA y calculadora de ROI por acción
- **Comparación** — Comparación lado a lado de hasta 4 acciones con gráfica combinada y tabla de métricas
- **Calendario de earnings** — Rastrea reportes de ganancias próximos y pasados para los símbolos de tu watchlist
- **Noticias financieras** — Feed de noticias del mercado y por empresa filtrado por símbolo
- **Alertas de precio** — Configura alertas personalizadas con condiciones de subida/bajada y notificaciones toast
- **Predicción con IA** — Predicciones de análisis técnico usando RSI, momentum, medias móviles y volatilidad
- **Calculadora de ROI** — Calcula el retorno de inversión para cualquier acción desde cualquier fecha histórica
- **Configuración** — Cambio de tema, gestión de watchlist y estado de la API

## Stack tecnológico

- **Framework** — Next.js 16 (App Router)
- **Lenguaje** — TypeScript
- **Estilos** — Tailwind CSS + shadcn/ui
- **Gráficas** — TradingView Lightweight Charts
- **Data Fetching** — TanStack Query (React Query)
- **Estado global** — Zustand (con persistencia)
- **Datos del mercado** — Finnhub API
- **Tema** — next-themes (modo oscuro/claro)

## Primeros pasos

### Requisitos previos

- Node.js 18+
- Una [API key gratuita de Finnhub](https://finnhub.io)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/SaulVaz/stock-dashboard.git
cd stock-dashboard
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:

```env
FINNHUB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FINNHUB_WS_URL=wss://ws.finnhub.io
```

4. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
src/
├── app/
│   ├── (dashboard)/          # Páginas del dashboard con layout de sidebar
│   │   ├── dashboard/        # Market Overview
│   │   ├── watchlist/        # Página de watchlist
│   │   ├── compare/          # Comparación de acciones
│   │   ├── calendar/         # Calendario de earnings
│   │   ├── news/             # Noticias financieras
│   │   ├── settings/         # Configuración
│   │   └── stock/[symbol]/   # Página de detalle de acción
│   ├── (landing)/            # Landing page (sin sidebar)
│   │   └── landing/
│   └── api/                  # API routes (lado del servidor)
│       ├── stock/            # Endpoints de datos de acciones
│       ├── calendar/         # Endpoints de earnings
│       └── news/             # Endpoints de noticias
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
├── hooks/                    # Hooks de React Query
├── lib/                      # Cliente de API, utilidades, modelo de predicción
├── store/                    # Stores de Zustand
└── types/                    # Interfaces de TypeScript
```

## API Routes

Todas las llamadas a la API de Finnhub pasan por API routes de Next.js para mantener la API key segura en el servidor.

| Ruta | Descripción |
|------|-------------|
| `GET /api/stock/quote/[symbol]` | Precio en tiempo real |
| `GET /api/stock/candles/[symbol]` | Datos históricos de precio |
| `GET /api/stock/profile/[symbol]` | Perfil de la empresa |
| `GET /api/stock/search` | Búsqueda de símbolos |
| `GET /api/stock/movers` | Top gainers y losers |
| `GET /api/stock/indices` | Índices del mercado |
| `GET /api/calendar/earnings/[symbol]` | Historial de earnings |
| `GET /api/news/market` | Noticias del mercado |
| `GET /api/news/company/[symbol]` | Noticias por empresa |

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `FINNHUB_API_KEY` | Tu API key de Finnhub (requerida) |
| `NEXT_PUBLIC_FINNHUB_WS_URL` | URL del WebSocket de Finnhub |

## Notas importantes

- Los intervalos intradía (1m, 5m, 15m, 30m, 1h) requieren un plan de pago de Finnhub
- Los datos de dividendos requieren un plan de pago de Finnhub
- El plan gratuito permite hasta 60 llamadas a la API por minuto
- Las alertas de precio se verifican cada 30 segundos basándose en el intervalo de refresco de React Query

## Licencia

MIT
