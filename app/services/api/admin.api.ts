import { IAdminProfile, IUser } from "../../common/types/api.types";
import { API } from "../EndpointResources.g";

import Fetcher from "@/common/helpers/instance";
import { REQUEST_METHODS } from "@/common/utils/networking";

export const getProfile = (): Promise<IAdminProfile> =>
  Fetcher({ method: REQUEST_METHODS.GET, url: API.admin.profile });

export const getUsers = (): Promise<IUser[]> =>
  Fetcher({ method: REQUEST_METHODS.GET, url: API.admin.users });
