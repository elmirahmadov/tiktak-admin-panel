import {
  IProduct,
  IProductCreate,
  IProductUpdate,
} from "../../../common/types/api.types";

export interface IProductStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getProducts: (
    cb?: (data: IProduct[]) => void,
    errCb?: (err: any) => void
  ) => Promise<IProduct[] | null>;
  getProduct: (
    id: number | string,
    cb?: (data: IProduct) => void,
    errCb?: (err: any) => void
  ) => Promise<IProduct | null>;
  createProduct: (
    data: IProductCreate,
    cb?: (data: IProduct) => void,
    errCb?: (err: any) => void
  ) => Promise<IProduct | null>;
  updateProduct: (
    id: number | string,
    data: IProductUpdate,
    cb?: (data: IProduct) => void,
    errCb?: (err: any) => void
  ) => Promise<IProduct | null>;
  deleteProduct: (
    id: number | string,
    cb?: () => void,
    errCb?: (err: any) => void
  ) => Promise<boolean>;
}

export interface IProductStore {
  loading: boolean;
  products: IProduct[];
  currentProduct: IProduct | null;
  actions: IProductStoreActions;
}
