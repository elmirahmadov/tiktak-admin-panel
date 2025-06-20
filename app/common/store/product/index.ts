import { useProductStore } from "./product.store";

export const useProduct = () =>
  useProductStore((state) => ({
    product: state.currentProduct,
    loading: state.loading,
  }));

export const useProducts = () =>
  useProductStore((state) => ({
    products: state.products,
    loading: state.loading,
  }));

export const useProductActions = () =>
  useProductStore((state) => state.actions);

export const useProductReset = () =>
  useProductStore((state) => state.actions.reset());
