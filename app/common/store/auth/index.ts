import { useAuthStore } from "./auth.store";

export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useAuth = () =>
  useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
  }));

export const useAuthReset = () =>
  useAuthStore((state) => state.actions.reset());
