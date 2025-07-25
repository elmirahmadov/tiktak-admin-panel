import { IAdminProfile, IUser } from "../../../common/types/api.types";

export interface IAdminStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getProfile: (errCb?: (err: any) => void) => Promise<void>;
  getUsers: (errCb?: (err: any) => void) => Promise<void>;
}

export interface IAdminStore {
  loading: boolean;
  profile: IAdminProfile | null;
  users: IUser[];
  actions: IAdminStoreActions;
}
