import { notification } from "antd";
import { create } from "zustand";

import { IAuthStore } from "./auth.types";
import { getProfile as fetchProfile } from "../../../services/api/admin.api";
import { authLogin, authRefresh } from "../../../services/api/auth.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<IAuthStore, "actions"> = {
  loading: false,
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null,
  isAuthenticated:
    typeof window !== "undefined"
      ? !!localStorage.getItem("access_token")
      : false,
};

export const useAuthStore = create<IAuthStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    login: async (data, cl, err) => {
      set({ loading: true });

      try {
        const response = await authLogin(data);

        if (response && response.data && response.data.data) {
          const apiData = response.data.data;

          if (apiData.tokens && apiData.profile) {
            const tokens = apiData.tokens;
            const accessToken = tokens.access_token;
            const refreshToken = tokens.refresh_token;
            const userData = {
              ...apiData.profile,
              phone: (apiData.profile as any).phone || "",
            };

            if (!accessToken || !refreshToken) {
              console.error("Token bilgileri eksik:", tokens);
              throw new Error("Token bilgileri bulunamadı");
            }

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            set({
              loading: false,
              user: userData,
              accessToken,
              refreshToken,
              isAuthenticated: true,
            });

            notification.success({
              message: "Giriş Başarılı!",
              description: "Hoş geldiniz, yönlendiriliyorsunuz.",
              placement: "topRight",
            });

            cl();
            return;
          }
        }

        console.error("API yanıtı beklenen formatta değil:", response);
        throw new Error("API yanıtı uygun formatta değil");
      } catch (error) {
        console.error("Login error detail:", error);
        const errorResponse = error as ErrorResponse;
        notification.error({
          message: "Giriş Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Bilinmeyen bir hata oluştu"}`,
          placement: "topRight",
        });

        err?.(error);
        set({ loading: false });
      }
    },

    refreshToken: async (data, cl, err) => {
      try {
        set({ loading: true });

        const response = await authRefresh(data);

        let accessToken, refreshTokenNew;

        if (response.data && response.data.data) {
          accessToken = response.data.data.access_token;
          refreshTokenNew = response.data.data.refresh_token;
        } else if (response.data) {
          accessToken = response.data.access_token;
          refreshTokenNew = response.data.refresh_token;
        } else {
          accessToken = response.access_token;
          refreshTokenNew = response.refresh_token;
        }

        if (!accessToken || !refreshTokenNew) {
          throw new Error("Token bilgileri bulunamadı");
        }

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshTokenNew);

        set({
          loading: false,
          accessToken,
          refreshToken: refreshTokenNew,
          isAuthenticated: true,
        });

        cl?.();
      } catch (error) {
        console.error("Refresh token hatası:", error);
        err?.(error);
        set({ loading: false, isAuthenticated: false });

        get().actions.logout();
      }
    },

    getProfile: async (errCb) => {
      set({ loading: true });

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          set({
            loading: false,
            isAuthenticated: false,
          });
          return;
        }

        const profileData = await fetchProfile();

        if (profileData) {
          const userData = {
            ...profileData,
            phone: (profileData as any).phone || "",
          };

          set({
            user: userData,
            loading: false,
            isAuthenticated: true,
          });
        } else {
          set({
            loading: false,
            isAuthenticated: false,
          });

          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        const errorResponse = error as ErrorResponse;
        notification.error({
          message: "Profil Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Profil bilgilerini yüklerken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(error);
        set({
          loading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    },

    logout: (cb) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      set({
        ...initial,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });

      notification.info({
        message: "Çıkış Yapıldı",
        description: "Başarıyla çıkış yaptınız.",
        placement: "topRight",
      });

      cb?.();
    },
  },
}));
