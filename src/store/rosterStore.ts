import { create } from 'zustand';
import { RosterEntry, RosterSide, RosterViewMode } from '@/types/roster';

type PositionFilter = Array<'GK' | 'DF' | 'MF' | 'FW'>;

interface RosterState {
  rosterHome: RosterEntry[];
  rosterAway: RosterEntry[];
  rosterInput: string;
  rosterSide: RosterSide;
  rosterMode: RosterViewMode;
  rosterFilterHome: PositionFilter;
  rosterFilterAway: PositionFilter;

  setRosterHome: (entries: RosterEntry[]) => void;
  setRosterAway: (entries: RosterEntry[]) => void;
  setRosterInput: (value: string) => void;
  setRosterSide: (side: RosterSide) => void;
  setRosterMode: (mode: RosterViewMode) => void;
  setRosterFilterHome: (filter: PositionFilter) => void;
  setRosterFilterAway: (filter: PositionFilter) => void;
}

export const useRosterStore = create<RosterState>((set) => ({
  rosterHome: [],
  rosterAway: [],
  rosterInput: '',
  rosterSide: 'home',
  rosterMode: 'number',
  rosterFilterHome: ['GK', 'DF', 'MF', 'FW'],
  rosterFilterAway: ['GK', 'DF', 'MF', 'FW'],

  setRosterHome: (entries) => set({ rosterHome: entries }),
  setRosterAway: (entries) => set({ rosterAway: entries }),
  setRosterInput: (value) => set({ rosterInput: value }),
  setRosterSide: (side) => set({ rosterSide: side }),
  setRosterMode: (mode) => set({ rosterMode: mode }),
  setRosterFilterHome: (filter) => set({ rosterFilterHome: filter }),
  setRosterFilterAway: (filter) => set({ rosterFilterAway: filter }),
}));
