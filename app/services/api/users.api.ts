import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

/**
 * Tüm kullanıcıları getir
 * @returns Kullanıcı listesi
 */
export const getAllUsers = async (): Promise<any> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.GET,
      url: API.users.getAll,
    });

    return response;
  } catch (error) {
    console.error("getUsersAll API hatası:", error);
    throw error;
  }
};
