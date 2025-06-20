import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export interface ICampaign {
  id: number;
  title: string;
  description?: string;
  img_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICampaignCreate {
  title: string;
  description?: string;
  img_url?: string;
}

export interface ICampaignUpdate {
  title?: string;
  description?: string;
  img_url?: string;
}

export const getAllCampaigns = async (): Promise<ICampaign[]> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.GET,
      url: API.campaign.getAll,
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("Kampanya API yanıtı beklenen formatta değil:", response);
    return [];
  } catch (error) {
    console.error("getAllCampaigns API hatası:", error);
    throw error;
  }
};

export const createCampaign = async (
  data: ICampaignCreate
): Promise<ICampaign> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.campaign.create,
      data,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error("createCampaign API hatası:", error);
    throw error;
  }
};

export const updateCampaign = async (
  id: number | string,
  data: ICampaignUpdate
): Promise<ICampaign> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.PUT,
      url: API.campaign.update(id),
      data,
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error("updateCampaign API hatası:", error);
    throw error;
  }
};

export const deleteCampaign = async (id: number | string): Promise<any> => {
  try {
    const response = await Fetcher({
      method: REQUEST_METHODS.DELETE,
      url: API.campaign.delete(id),
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    console.error("deleteCampaign API hatası:", error);
    throw error;
  }
};
