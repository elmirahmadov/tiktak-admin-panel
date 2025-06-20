import {
  ICampaign,
  ICampaignCreate,
  ICampaignUpdate,
} from "../../../services/api/campaign.api";

export interface ICampaignStoreActions {
  setLoading: (loading: boolean) => void;
  reset: () => void;
  getCampaigns: (
    cb?: (data: ICampaign[]) => void,
    errCb?: (err: any) => void
  ) => Promise<ICampaign[] | null>;
  createCampaign: (
    data: ICampaignCreate,
    cb?: (data: ICampaign) => void,
    errCb?: (err: any) => void
  ) => Promise<ICampaign | null>;
  updateCampaign: (
    id: number | string,
    data: ICampaignUpdate,
    cb?: (data: ICampaign) => void,
    errCb?: (err: any) => void
  ) => Promise<ICampaign | null>;
  deleteCampaign: (
    id: number | string,
    cb?: () => void,
    errCb?: (err: any) => void
  ) => Promise<boolean>;
}

export interface ICampaignStore {
  loading: boolean;
  campaigns: ICampaign[];
  currentCampaign: ICampaign | null;
  actions: ICampaignStoreActions;
}
