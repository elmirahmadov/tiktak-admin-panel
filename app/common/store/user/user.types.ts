import { IUser } from "../../types/api.types";

export interface IUserStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getUsers: (
    cb?: (data: IUser[]) => void,
    errCb?: (err: any) => void
  ) => Promise<IUser[] | null>;
}

export interface IUserStore {
  loading: boolean;
  users: IUser[];
  currentUser: IUser | null;
  actions: IUserStoreActions;
}
