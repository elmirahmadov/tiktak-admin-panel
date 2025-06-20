import {
  IOrder,
  IOrderStats,
  IOrderStatusUpdate,
} from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

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
