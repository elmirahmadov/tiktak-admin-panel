import {
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
} from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export const createCategory = async (
  data: ICategoryCreate
): Promise<ICategory> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.POST,
    url: API.category.create,
    data,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data || response;
};

export const updateCategory = async (
  id: number | string,
  data: ICategoryUpdate
): Promise<ICategory> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.PUT,
    url: API.category.update(id),
    data,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data || response;
};

export const deleteCategory = async (id: number | string): Promise<any> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.DELETE,
    url: API.category.delete(id),
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data || response;
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await Fetcher({
    method: REQUEST_METHODS.GET,
    url: API.category.getAll,
  });

  if (response.data && response.data.data) {
    return response.data.data;
  }

  return response.data || response;
};
