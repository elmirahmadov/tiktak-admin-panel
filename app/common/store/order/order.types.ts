import {
  IOrder,
  IOrderStats,
  IOrderStatusUpdate,
} from "../../../services/api/order.api";

export interface IOrderStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getOrders: (
    cb?: (data: IOrder[]) => void,
    errCb?: (err: any) => void
  ) => Promise<IOrder[] | null>;
  getOrderStats: (
    cb?: (data: IOrderStats) => void,
    errCb?: (err: any) => void
  ) => Promise<IOrderStats | null>;
  updateOrderStatus: (
    id: number | string,
    data: IOrderStatusUpdate,
    cb?: (data: IOrder) => void,
    errCb?: (err: any) => void
  ) => Promise<IOrder | null>;
}

export interface IOrderStore {
  loading: boolean;
  orders: IOrder[];
  currentOrder: IOrder | null;
  stats: IOrderStats | null;
  actions: IOrderStoreActions;
}
