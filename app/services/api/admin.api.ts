import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export interface IProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  created_at: string;
}

export const getProfile = (): Promise<IProfile> =>
  Fetcher({ method: REQUEST_METHODS.GET, url: API.admin.profile });

export const getUsers = (): Promise<IUser[]> =>
  Fetcher({ method: REQUEST_METHODS.GET, url: API.admin.users });
