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
          message: "Siparişleri Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Siparişleri yüklerken bir hata oluştu"}`,
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
          message: "İstatistik Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "İstatistikleri yüklerken bir hata oluştu"}`,
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
          message: "Sipariş Durumu Güncellendi",
          description: "Sipariş durumu başarıyla güncellendi.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Sipariş durumu güncelleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Sipariş Güncelleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Sipariş durumu güncellenirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },
  },
}));
