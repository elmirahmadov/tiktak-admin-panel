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
          message: "Profil Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Profil bilgilerini yüklerken bir hata oluştu"}`,
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
          message: "Kullanıcı Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kullanıcıları yüklerken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
      }
    },
  },
}));
