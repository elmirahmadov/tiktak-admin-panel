import {
  IProduct,
  IProductCreate,
  IProductUpdate,
} from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export const getAllProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.GET,
      url: API.product.getAll,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (
      response.data &&
      response.data.products &&
      Array.isArray(response.data.products)
    ) {
      return response.data.products;
    }

    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items;
    }

    if (
      response.data &&
      response.data.results &&
      Array.isArray(response.data.results)
    ) {
      return response.data.results;
    }

    console.warn("Ürün API yanıtı beklenen formatta değil:", response);
    return [];
  } catch (error) {
    console.error("getAllProducts API hatası:", error);
    throw error;
  }
};

export const createProduct = async (
  data: IProductCreate
): Promise<IProduct> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.product.create,
    data,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data;
};

export const updateProduct = async (
  id: number | string,
  data: IProductUpdate
): Promise<IProduct> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.PUT,
    url: API.product.update(id),
    data,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data;
};

export const deleteProduct = async (id: number | string): Promise<any> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.DELETE,
    url: API.product.delete(id),
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data;
};
