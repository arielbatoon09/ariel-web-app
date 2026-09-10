import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ListingLayout = "grid" | "list";

interface ListingLayoutState {
  layout: ListingLayout;
  setLayout: (layout: ListingLayout) => void;
}

export const useListingLayoutStore = create<ListingLayoutState>()(
  persist(
    (set) => ({
      layout: "grid",
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "public-listing-layout",
    }
  )
);

/** Convenience selector matching existing listing call sites. */
export function useListingLayout() {
  const layout = useListingLayoutStore((state) => state.layout);
  const setLayout = useListingLayoutStore((state) => state.setLayout);
  return { layout, setLayout };
}
