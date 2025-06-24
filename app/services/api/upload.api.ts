import { IUploadResponse } from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export const uploadFile = async (file: File): Promise<IUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await Fetcher({
      method: REQUEST_METHODS.POST,
      url: API.upload.upload,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    }

    if (response.data && response.data.file) {
      return response.data.file;
    }

    if (response.data && response.data.url) {
      return response.data;
    }

    console.warn("Upload API yanıtı beklenen formatta değil:", response);
    return response.data;
  } catch (error) {
    console.error("uploadFile API hatası:", error);
    throw error;
  }
};
