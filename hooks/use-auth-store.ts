import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/error-utils";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  initialize: async () => {
    set({ isLoading: true });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        set({ error: error.message, isLoading: false });
        return { success: false, error: error.message };
      }
      set({ user: data.user, isLoading: false });
      return { success: true };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "An unexpected error occurred.");
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
    } finally {
      set({ user: null, isLoading: false });
    }
  },
}));
