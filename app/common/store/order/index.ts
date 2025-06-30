import { useOrderStore } from "./order.store";

export const useOrders = () =>
  useOrderStore((state) => ({
    orders: state.orders,
    loading: state.loading,
  }));

export const useOrderStats = () =>
  useOrderStore((state) => ({
    stats: state.stats,
    loading: state.loading,
  }));

export const useCurrentOrder = () =>
  useOrderStore((state) => ({
    order: state.currentOrder,
    loading: state.loading,
  }));

export const useOrderActions = () => useOrderStore((state) => state.actions);

export const useOrderReset = () =>
  useOrderStore((state) => state.actions.reset());