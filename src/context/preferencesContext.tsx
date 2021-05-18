import { useNavigation } from '@react-navigation/core';
import React, { useContext } from 'react';
import { Appearance } from 'react-native-appearance';
import {
  defaultPreferences,
  getPreferenceBool,
  getPreferenceObject,
  isValidPreferenceKey,
  PreferenceKeys,
  PreferencesType,
} from '../utils/asyncStorage';
import {
  getAmicaleServices,
  getINSAServices,
  getSpecialServices,
  getStudentServices,
} from '../utils/Services';

const colorScheme = Appearance.getColorScheme();

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

export function useShouldShowMascot(route: string) {
  const { preferences, updatePreferences } = usePreferences();
  const key = route + 'ShowMascot';
  let shouldShow = false;
  if (isValidPreferenceKey(key)) {
    shouldShow = getPreferenceBool(key, preferences) !== false;
  }

  const setShouldShow = (show: boolean) => {
    if (isValidPreferenceKey(key)) {
      updatePreferences(key, show);
    } else {
      console.log('Invalid preference key: ' + key);
    }
  };

  return { shouldShow, setShouldShow };
}

export function useDarkTheme() {
  const { preferences } = usePreferences();
  return (
    (getPreferenceBool(PreferenceKeys.nightMode, preferences) !== false &&
      (getPreferenceBool(PreferenceKeys.nightModeFollowSystem, preferences) ===
        false ||
        colorScheme === 'no-preference')) ||
    (getPreferenceBool(PreferenceKeys.nightModeFollowSystem, preferences) !==
      false &&
      colorScheme === 'dark')
  );
}

export function useCurrentDashboard() {
  const { preferences, updatePreferences } = usePreferences();
  const navigation = useNavigation();
  const dashboardIdList = getPreferenceObject(
    PreferenceKeys.dashboardItems,
    preferences
  ) as Array<string>;

  const updateCurrentDashboard = (newList: Array<string>) => {
    updatePreferences(PreferenceKeys.dashboardItems, newList);
  };

  const allDatasets = [
    ...getAmicaleServices(navigation.navigate),
    ...getStudentServices(navigation.navigate),
    ...getINSAServices(navigation.navigate),
    ...getSpecialServices(navigation.navigate),
  ];
  return {
    currentDashboard: allDatasets.filter((item) =>
      dashboardIdList.includes(item.key)
    ),
    currentDashboardIdList: dashboardIdList,
    updateCurrentDashboard: updateCurrentDashboard,
  };
}
