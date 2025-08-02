import { notification } from "antd";
import { create } from "zustand";

import { IAdminStore } from "./admin.types";
import { getProfile, getUsers } from "../../../services/api/admin.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<IAdminStore, "actions"> = {
  loading: false,
  profile: null,
  users: [],
};

export const useAdminStore = create<IAdminStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getProfile: async (errCb) => {
      set({ loading: true });

      try {
        const profileData = await getProfile();
        set({ profile: profileData, loading: false });
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Profil Yükləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message || "Profil Yükləmə Xətası"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
      }
    },

    getUsers: async (errCb) => {
      set({ loading: true });

      try {
        const usersData = await getUsers();
        set({ users: usersData, loading: false });
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "İstifadəçilər Yüklənməsi Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
      }
    },
  },
}));
