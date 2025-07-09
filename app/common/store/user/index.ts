import { useUserStore } from "./user.store";

export const useUsers = () =>
  useUserStore((state) => ({
    users: state.users,
    loading: state.loading,
  }));

export const useCurrentUser = () =>
  useUserStore((state) => ({
    user: state.currentUser,
    loading: state.loading,
  }));

export const useUserActions = () => useUserStore((state) => state.actions);

export const useUserReset = () =>
  useUserStore((state) => state.actions.reset());
