import { notification } from "antd";
import { create } from "zustand";

import { ICampaignStore } from "./campaign.types";
import {
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  updateCampaign,
} from "../../../services/api/campaign.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<ICampaignStore, "actions"> = {
  loading: false,
  campaigns: [],
  currentCampaign: null,
};

export const useCampaignStore = create<ICampaignStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getCampaigns: async (cb, errCb) => {
      set({ loading: true });

      try {
        const campaignsData = await getAllCampaigns();

        set({ campaigns: campaignsData, loading: false });

        cb?.(campaignsData);
        return campaignsData;
      } catch (err) {
        console.error("Kampanya yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampanyaları Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kampanyaları yüklerken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    createCampaign: async (data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await createCampaign(data);

        set((state) => ({
          campaigns: [...state.campaigns, response],
          currentCampaign: response,
          loading: false,
        }));

        notification.success({
          message: "Kampanya Oluşturuldu",
          description: "Yeni kampanya başarıyla oluşturuldu.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Kampanya oluşturma hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampanya Oluşturma Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kampanya oluştururken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    updateCampaign: async (id, data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await updateCampaign(id, data);

        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === (typeof id === "string" ? parseInt(id) : id) ? response : c
          ),
          currentCampaign: response,
          loading: false,
        }));

        notification.success({
          message: "Kampanya Güncellendi",
          description: "Kampanya başarıyla güncellendi.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Kampanya güncelleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampanya Güncelleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kampanya güncellenirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    deleteCampaign: async (id, cb, errCb) => {
      set({ loading: true });

      try {
        await deleteCampaign(id);

        set((state) => ({
          campaigns: state.campaigns.filter(
            (c) => c.id !== (typeof id === "string" ? parseInt(id) : id)
          ),
          currentCampaign: null,
          loading: false,
        }));

        notification.success({
          message: "Kampanya Silindi",
          description: "Kampanya başarıyla silindi.",
          placement: "topRight",
        });

        cb?.();
        return true;
      } catch (err) {
        console.error("Kampanya silme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampanya Silme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kampanya silinirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return false;
      }
    },
  },
}));
