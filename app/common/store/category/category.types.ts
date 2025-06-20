import {
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
} from "../../../common/types/api.types";

export interface ICategoryStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getCategories: (
    cb?: (data: ICategory[]) => void,
    errCb?: (err: any) => void
  ) => Promise<ICategory[] | null>;
  createCategory: (
    data: ICategoryCreate,
    cb?: (data: ICategory) => void,
    errCb?: (err: any) => void
  ) => Promise<ICategory | null>;
  updateCategory: (
    id: number | string,
    data: ICategoryUpdate,
    cb?: (data: ICategory) => void,
    errCb?: (err: any) => void
  ) => Promise<ICategory | null>;
  deleteCategory: (
    id: number | string,
    cb?: () => void,
    errCb?: (err: any) => void
  ) => Promise<boolean>;
}

export interface ICategoryStore {
  loading: boolean;
  categories: ICategory[];
  currentCategory: ICategory | null;
  actions: ICategoryStoreActions;
}
