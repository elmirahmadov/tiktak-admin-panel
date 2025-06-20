import { useAdminStore } from "./admin.store";

export const useAdminActions = () => useAdminStore((state) => state.actions);

export const useProfile = () =>
  useAdminStore((state) => ({
    profile: state.profile,
    loading: state.loading,
  }));

export const useUsers = () =>
  useAdminStore((state) => ({
    users: state.users,
    loading: state.loading,
  }));

export const useAdminReset = () =>
  useAdminStore((state) => state.actions.reset());
