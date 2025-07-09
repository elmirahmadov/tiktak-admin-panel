import { create } from "zustand";

import { IUserStore } from "./user.types";
import { getAllUsers } from "../../../services/api/users.api";

const initial: Omit<IUserStore, "actions"> = {
  loading: false,
  users: [],
  currentUser: null,
};

export const useUserStore = create<IUserStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading) => set({ loading }),

    reset: () => set({ ...initial }),

    getUsers: async (clb, errCb) => {
      set({ loading: true });
      try {
        const res = await getAllUsers();
        set({ users: res.data.data, loading: false });
        clb?.(res.data.data);
        return res.data.data;
      } catch (error) {
        set({ loading: false });
        errCb?.(error);
        return null;
      }
    },
  },
}));
