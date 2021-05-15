import React, { useState } from 'react';
import {
  defaultPreferences,
  PreferenceKeys,
  PreferencesType,
  setPreference,
} from '../../utils/asyncStorage';
import {
  PreferencesContext,
  PreferencesContextType,
} from '../../utils/preferencesContext';

type Props = {
  children: React.ReactChild;
  initialPreferences: PreferencesType;
};

export default function PreferencesProvider(props: Props) {
  const updatePreferences = (
    key: PreferenceKeys,
    value: number | string | boolean | object | Array<any>
  ) => {
    setPreferencesState((prevState) => {
      const prevPreferences = { ...prevState.preferences };
      const newPrefs = setPreference(key, value, prevPreferences);
      const newSate = {
        ...prevState,
        preferences: { ...newPrefs },
      };
      return newSate;
    });
  };

  const resetPreferences = () => {
    setPreferencesState((prevState) => {
      const prevPreferences = { ...prevState.preferences };
      let newPreferences = { ...prevPreferences };
      Object.values(PreferenceKeys).forEach((key) => {
        newPreferences = setPreference(
          key,
          defaultPreferences[key],
          prevPreferences
        );
      });
      const newSate = {
        ...prevState,
        preferences: { ...newPreferences },
      };
      return newSate;
    });
  };

  const [
    preferencesState,
    setPreferencesState,
  ] = useState<PreferencesContextType>({
    preferences: { ...props.initialPreferences },
    updatePreferences: updatePreferences,
    resetPreferences: resetPreferences,
  });

  return (
    <PreferencesContext.Provider value={preferencesState}>
      {props.children}
    </PreferencesContext.Provider>
  );
}
