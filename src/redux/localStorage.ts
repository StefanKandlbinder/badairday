import { RootState } from '../types';

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState) as Partial<RootState>;
  } catch {
    return undefined;
  }
};

export const saveState = (state: Partial<RootState>): void => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const clearState = (): void => {
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
};
