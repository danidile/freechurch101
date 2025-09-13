import { create } from "zustand";
import { fullSetListT } from "@/utils/types/types";
import { getSetList } from "@/hooks/GET/getSetList";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { getSelectedChurchTeams } from "@/hooks/GET/getSelectedChurchTeams";

type SetlistsStore = {
  setlists: fullSetListT[]; // always an array, easier to work with
  loading: boolean;
  error: string | null;
  setSetlists: (setlists: fullSetListT[]) => void;
  fetchSetlists: (setListId: string) => Promise<void>;
};

export const useSetlistsStore = create<SetlistsStore>((set) => ({
  setlists: [],
  loading: false,
  error: null,

  setSetlists: (newSetlists) => set({ setlists: newSetlists }),

  fetchSetlists: async (setListId) => {
    set({ loading: true, error: null });

    try {
      // 1. Fetch setlist
      const setlist = await getSetList(setListId);

      set((state) => {
        //CHECK IF THE SETLIST IS ALREADY PRESENT IN THE STATE
        const exists = state.setlists.some((s) => s.setlist.id === setlist.id);

        if (exists) {
          return {
            setlists: state.setlists.map((s) =>
              s.setlist.id === setlist.id
                ? { ...s, setlist } // update only that one
                : s
            ),
          };
        }

        return {
          setlists: [
            ...state.setlists,
            {
              setlist,
              schedule: null,
              teams: null,
            } as fullSetListT,
          ],
        };
      });

      // 2. Fetch schedule
      const schedule = await getSetlistSchedule(setListId);
      set((state) => ({
        setlists: state.setlists.map((s) =>
          s.setlist.id === setlist.id ? { ...s, schedule } : s
        ),
      }));
      // 3. Fetch teams
      const teams = await getSelectedChurchTeams(setListId);
      set((state) => ({
        setlists: state.setlists.map((s) =>
          s.setlist.id === setlist.id ? { ...s, teams } : s
        ),
        loading: false,
      }));
    } catch (err: any) {
      console.error("Error in fetchSetlists:", err);
      set({ error: err.message || "Unknown error", loading: false });
    }
  },
}));
