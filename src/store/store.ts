import { Package, Subject } from "@/types/interface";
import { create } from "zustand";

type PackageState = {
  item: Package | null;
  addToCart: (item: Package) => void;
  clearCart: () => void;
};

type SubjectState = {
  item: Subject | null;
  addToCart: (item: Subject) => void;
  clearCart: () => void;
};

export const useSubjectStore = create<SubjectState>((set) => ({
  item: null,
  addToCart: (item) => set({ item }),
  clearCart: () => set({ item: null }),
}));

export const usePackageStore = create<PackageState>((set) => ({
  item: null,
  addToCart: (item) => set({ item }),
  clearCart: () => set({ item: null }),
}));
