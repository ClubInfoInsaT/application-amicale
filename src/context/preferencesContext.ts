import React, { useContext } from 'react';
import {
  defaultPreferences,
  PreferenceKeys,
  PreferencesType,
} from '../utils/asyncStorage';

export type PreferencesContextType = {
  preferences: PreferencesType;
  updatePreferences: (
    key: PreferenceKeys,
    value: number | string | boolean | object | Array<any>
  ) => void;
  resetPreferences: () => void;
};

export const PreferencesContext = React.createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => undefined,
  resetPreferences: () => undefined,
});

export function usePreferences() {
  return useContext(PreferencesContext);
}
