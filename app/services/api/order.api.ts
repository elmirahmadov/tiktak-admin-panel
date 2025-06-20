import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export interface IOrder {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  delivery_phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface IOrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export interface IOrderStatusUpdate {
  status: string;
  notes?: string;
}

export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.GET,
      url: API.order.getAll,
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("Sipariş API yanıtı beklenen formatta değil:", response);
    return [];
  } catch (error) {
    console.error("getAllOrders API hatası:", error);
    throw error;
  }
};

export const getOrderStats = async (): Promise<IOrderStats> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.GET,
      url: API.order.getStats,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error("getOrderStats API hatası:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: number | string,
  data: IOrderStatusUpdate
): Promise<IOrder> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.PUT,
      url: API.order.updateStatus(id),
      data,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error("updateOrderStatus API hatası:", error);
    throw error;
  }
};
