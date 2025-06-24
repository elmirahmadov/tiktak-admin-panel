import { notification } from "antd";
import { create } from "zustand";

import { IUploadStore } from "./upload.types";
import { uploadFile } from "../../../services/api/upload.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<IUploadStore, "actions"> = {
  loading: false,
  currentUpload: null,
  uploads: [],
};

export const useUploadStore = create<IUploadStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    uploadFile: async (file, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await uploadFile(file);

        set((state) => ({
          currentUpload: response,
          uploads: [...state.uploads, response],
          loading: false,
        }));

        notification.success({
          message: "Dosya Yüklendi",
          description: `${file.name} başarıyla yüklendi.`,
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Dosya yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Dosya Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Dosya yüklenirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },
  },
}));
