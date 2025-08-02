import { notification } from "antd";
import { create } from "zustand";

import { IProductStore } from "./product.types";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../../services/api/product.api";

type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
};

const initial: Omit<IProductStore, "actions"> = {
  loading: false,
  currentProduct: null,
  products: [],
};

export const useProductStore = create<IProductStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getProducts: async (cb, errCb) => {
      set({ loading: true });

      try {
        const productsData = await getAllProducts();

        set({ products: productsData, loading: false });

        cb?.(productsData);
        return productsData;
      } catch (err) {
        console.error("Ürün yükleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Məhsulları Yükləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message || "Məhsulları yükləyərkən xəta baş verdi"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    getProduct: async (id, cb, errCb) => {
      try {
        const currentProduct = get().products.find(
          (p) => p.id === (typeof id === "string" ? parseInt(id) : id)
        );

        if (currentProduct) {
          set({ currentProduct });
          cb?.(currentProduct);
          return currentProduct;
        }

        throw new Error("Məhsul tapılmadı");
      } catch (err) {
        console.error("Ürün getirme hatası:", err);
        errCb?.(err);
        return null;
      }
    },

    createProduct: async (data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await createProduct(data);

        set((state) => ({
          currentProduct: response,
          products: [...state.products, response],
          loading: false,
        }));

        notification.success({
          message: "Məhsul Yaradıldı",
          description: "Yeni məhsul uğurla yaradıldı.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Ürün oluşturma hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Məhsul Yaradılması Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message || "Məhsul yaradılarkən xəta baş verdi"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    updateProduct: async (id, data, cb, errCb) => {
      set({ loading: true });

      try {
        const response = await updateProduct(id, data);

        set((state) => ({
          currentProduct: response,
          products: state.products.map((p) =>
            p.id === (typeof id === "string" ? parseInt(id) : id) ? response : p
          ),
          loading: false,
        }));

        notification.success({
          message: "Məhsul Yeniləndi",
          description: "Məhsul uğurla yeniləndi.",
          placement: "topRight",
        });

        cb?.(response);
        return response;
      } catch (err) {
        console.error("Ürün güncelleme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Məhsul Yeniləmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message || "Məhsul yenilənərkən xəta baş verdi"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return null;
      }
    },

    deleteProduct: async (id, cb, errCb) => {
      set({ loading: true });

      try {
        await deleteProduct(id);

        set((state) => ({
          currentProduct: null,
          products: state.products.filter(
            (p) => p.id !== (typeof id === "string" ? parseInt(id) : id)
          ),
          loading: false,
        }));

        notification.success({
          message: "Məhsul Silindi",
          description: "Məhsul uğurla silindi.",
          placement: "topRight",
        });

        cb?.();
        return true;
      } catch (err) {
        console.error("Ürün silme hatası:", err);
        const errorResponse = err as ErrorResponse;
        notification.error({
          message: "Məhsul Silmə Xətası",
          description: `Xəta: ${errorResponse?.response?.data?.message || "Məhsul silinərkən xəta baş verdi"}`,
          placement: "topRight",
        });

        errCb?.(err);
        set({ loading: false });
        return false;
      }
    },
  },
}));
