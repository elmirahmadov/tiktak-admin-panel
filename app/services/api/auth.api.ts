import { ILogin } from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export const authLogin = async (data: ILogin): Promise<any> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.login,
      data,
    });

    return response;
  } catch (error) {
    console.error("authLogin API hatası:", error);
    throw error;
  }
};

export const authRefresh = async (data: {
  refresh_token: string;
}): Promise<any> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.auth.refresh,
      data,
    });

    return response;
  } catch (error) {
    console.error("authRefresh API hatası:", error);
    throw error;
  }
};
