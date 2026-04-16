import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlertCondition = "above" | "below";
export type AlertStatus = "active" | "triggered";

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: AlertCondition;
  status: AlertStatus;
  createdAt: number;
  triggeredAt?: number;
}

interface AlertsStore {
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: AlertCondition) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  clearTriggered: () => void;
  getAlertsForSymbol: (symbol: string) => PriceAlert[];
}

export const useAlertsStore = create<AlertsStore>()(
  persist(
    (set, get) => ({
      alerts: [],

      addAlert: (symbol, targetPrice, condition) => {
        const newAlert: PriceAlert = {
          id: `${symbol}-${Date.now()}`,
          symbol,
          targetPrice,
          condition,
          status: "active",
          createdAt: Date.now(),
        };
        set((state) => ({ alerts: [...state.alerts, newAlert] }));
      },

      removeAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        }));
      },

      triggerAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id
              ? { ...a, status: "triggered", triggeredAt: Date.now() }
              : a
          ),
        }));
      },

      clearTriggered: () => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.status === "active"),
        }));
      },

      getAlertsForSymbol: (symbol) => {
        return get().alerts.filter((a) => a.symbol === symbol);
      },
    }),
    {
      name: "alerts-storage",
    }
  )
);