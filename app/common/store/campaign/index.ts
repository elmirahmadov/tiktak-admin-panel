import { useCampaignStore } from "./campaign.store";

export const useCampaigns = () =>
  useCampaignStore((state) => ({
    campaigns: state.campaigns,
    loading: state.loading,
  }));

export const useCurrentCampaign = () =>
  useCampaignStore((state) => ({
    campaign: state.currentCampaign,
    loading: state.loading,
  }));

export const useCampaignActions = () =>
  useCampaignStore((state) => state.actions);

export const useCampaignReset = () =>
  useCampaignStore((state) => state.actions.reset());
