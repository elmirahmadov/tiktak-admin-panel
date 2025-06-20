import { IProfile, IUser } from "../../../services/api/admin.api";

export interface IAdminStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getProfile: (errCb?: (err: any) => void) => Promise<void>;
  getUsers: (errCb?: (err: any) => void) => Promise<void>;
}

export interface IAdminStore {
  loading: boolean;
  profile: IProfile | null;
  users: IUser[];
  actions: IAdminStoreActions;
}
