import { IUploadResponse } from "../../types/api.types";

export interface IUploadStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  uploadFile: (
    file: File,
    cb?: (data: IUploadResponse) => void,
    errCb?: (err: any) => void
  ) => Promise<IUploadResponse | null>;
}

export interface IUploadStore {
  loading: boolean;
  uploads: IUploadResponse[];
  currentUpload: IUploadResponse | null;
  actions: IUploadStoreActions;
}
