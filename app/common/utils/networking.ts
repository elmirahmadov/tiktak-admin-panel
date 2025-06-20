import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

interface INetworkError {
  message: string;
  statusCode: HttpStatusCode;
}

export enum REQUEST_METHODS {
  POST = "POST",
  GET = "GET",
  DELETE = "DELETE",
  PATCH = "PATCH",
  PUT = "PUT",
}

export const INSTANCE_METHODS = {
  GET: { method: REQUEST_METHODS.GET },
  POST: { method: REQUEST_METHODS.POST },
  DELETE: { method: REQUEST_METHODS.DELETE },
  PATCH: { method: REQUEST_METHODS.PATCH },
  PUT: { method: REQUEST_METHODS.PUT },
};

export interface RequestOptions {
  method: REQUEST_METHODS;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

export const responseHandler = (response: AxiosResponse) => {
  return response.data;
};

export const errorHandler = (e: AxiosError, returnable?: boolean) => {
  const errorResponse = e.response?.data as INetworkError;

  if (returnable) {
    return errorResponse;
  }

  return null;
};
