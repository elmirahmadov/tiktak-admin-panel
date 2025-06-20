import { ILogin, ILoginResponse } from "../../../services/api/auth.api";

export interface IAuthStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  login: (
    data: ILogin,
    cl: () => void,
    err?: (err: any) => void
  ) => Promise<void>;
  refreshToken: (
    data: { refresh_token: string },
    cl?: () => void,
    err?: (err: any) => void
  ) => Promise<void>;
  getProfile: (errCb?: (err: any) => void) => Promise<void>;
  logout: (cb?: () => void) => void;
}

export interface IAuthStore {
  loading: boolean;
  user: ILoginResponse["user"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  actions: IAuthStoreActions;
}
