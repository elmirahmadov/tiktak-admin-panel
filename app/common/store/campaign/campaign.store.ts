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
        console.error("Kampaniyaları yükləmə xətası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampaniyaları Yükləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
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
          message: "Kampaniya Yaradıldı",
          description: "Yeni kampaniya uğurla yaradıldı.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampaniya Yaradılması Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
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
          message: "Kampaniya Yeniləndi",
          description: "Kampaniya uğurla yeniləndi.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampaniya Yenilənməsi Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
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
          message: "Kampaniya Silindi",
          description: "Kampaniya uğurla silindi.",
          placement: "topRight",
        });

        cb?.();
        return true;
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kampaniya Silinməsi Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return false;
      }
    },
  },
}));
