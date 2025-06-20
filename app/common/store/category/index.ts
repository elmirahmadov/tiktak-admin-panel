import { useCategoryStore } from "./category.store";

export const useCategories = () =>
  useCategoryStore((state) => ({
    categories: state.categories,
    loading: state.loading,
  }));

export const useCategoryActions = () =>
  useCategoryStore((state) => state.actions);

export const useCategoryReset = () =>
  useCategoryStore((state) => state.actions.reset());
