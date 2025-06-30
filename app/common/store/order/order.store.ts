import { notification } from "antd";
import { create } from "zustand";

import { IOrderStore } from "./order.types";
import {
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
} from "../../../services/api/order.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<IOrderStore, "actions"> = {
  loading: false,
  orders: [],
  currentOrder: null,
  stats: null,
};

export const useOrderStore = create<IOrderStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getOrders: async (cb, errCb) => {
      set({ loading: true });

      try {
        const ordersData = await getAllOrders();

        set({ orders: ordersData, loading: false });

        cb?.(ordersData);
        return ordersData;
      } catch (err) {
        console.error("Sipariş yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Sifariş Yükləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    getOrderStats: async (cb, errCb) => {
      set({ loading: true });

      try {
        const statsData = await getOrderStats();

        set({ stats: statsData, loading: false });

        cb?.(statsData);
        return statsData;
      } catch (err) {
        console.error("Sipariş istatistikleri yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "İstatistika Yükləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    updateOrderStatus: async (id, data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await updateOrderStatus(id, data);

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === (typeof id === "string" ? parseInt(id) : id) ? response : o
          ),
          currentOrder: response,
          loading: false,
        }));

        notification.success({
          message: "Sifariş Statusu Güncəlləndi",
          description: "Sipariş Statusunu Güncəllədiniz",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Sipariş durumu güncelleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Sifariş Güncəlləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },
  },
}));

