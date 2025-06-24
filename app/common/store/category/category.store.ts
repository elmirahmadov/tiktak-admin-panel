import { notification } from "antd";
import { create } from "zustand";

import { ICategoryStore } from "./category.types";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../../services/api/category.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<ICategoryStore, "actions"> = {
  loading: false,
  categories: [],
  currentCategory: null,
};

export const useCategoryStore = create<ICategoryStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getCategories: async (cb, errCb) => {
      set({ loading: true });

      try {
        const categories = await getAllCategories();

        set({ categories, loading: false });

        cb?.(categories);
        return categories;
      } catch (err) {
        console.error("Kategori yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kategori Yükleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kategorileri yüklerken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    getCategory: async (id, cb, errCb) => {
      try {
        const currentCategory = get().categories.find(
          (c) => c.id === (typeof id === "string" ? parseInt(id) : id)
        );

        if (currentCategory) {
          set({ currentCategory });
          cb?.(currentCategory);
          return currentCategory;
        }

        throw new Error("Kategori bulunamadı");
      } catch (err) {
        console.error("Kategori getirme hatası:", err);
        errCb?.(err);
        return null;
      }
    },

    createCategory: async (data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await createCategory(data);

        console.log("API'den dönen create response:", response);

        set((state) => ({
          categories: [response, ...state.categories],
          currentCategory: response,
          loading: false,
        }));

        notification.success({
          message: "Kategori Oluşturuldu",
          description: "Yeni kategori başarıyla oluşturuldu.",
          placement: "topRight",
          duration: 4,
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Kategori oluşturma hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kategori Oluşturma Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kategori oluştururken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    updateCategory: async (id, data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await updateCategory(id, data);

        console.log("API'den dönen update response:", response);

        set((state) => {
          const targetId = typeof id === "string" ? parseInt(id) : id;
          const originalCategories = [...state.categories];
          const targetIndex = originalCategories.findIndex(
            (cat) => cat.id === targetId
          );

          console.log("Update işlemi:", {
            targetId,
            targetIndex,
            originalItem: originalCategories[targetIndex],
            response,
          });

          if (targetIndex === -1) {
            console.error(
              "Güncellenmek istenen kategori bulunamadı:",
              targetId
            );
            return { ...state, loading: false };
          }

          const originalItem = originalCategories[targetIndex];
          const updatedItem = {
            ...originalItem,
            ...response,
            created_at: originalItem.created_at,
            id: originalItem.id,
          };

          console.log("Final updated item:", updatedItem);

          originalCategories[targetIndex] = updatedItem;

          return {
            categories: originalCategories,
            currentCategory: updatedItem,
            loading: false,
          };
        });

        notification.success({
          message: "Kategori Güncellendi",
          description: "Kategori başarıyla güncellendi.",
          placement: "topRight",
          duration: 4,
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Kategori güncelleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kategori Güncelleme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kategori güncellenirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    deleteCategory: async (id, cb, errCb) => {
      set({ loading: true });

      try {
        await deleteCategory(id);

        set((state) => ({
          categories: state.categories.filter(
            (cat) => cat.id !== (typeof id === "string" ? parseInt(id) : id)
          ),
          currentCategory: null,
          loading: false,
        }));

        notification.success({
          message: "Kategori Silindi",
          description: "Kategori başarıyla silindi.",
          placement: "topRight",
          duration: 4,
        });

        cb?.();
        return true;
      } catch (err) {
        console.error("Kategori silme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Kategori Silme Hatası",
          description: `Hata: ${errorResponse?.response?.data?.message || "Kategori silinirken bir hata oluştu"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return false;
      }
    },
  },
}));
