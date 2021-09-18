import { useNavigation } from '@react-navigation/core';
import React, { useContext } from 'react';
import { Appearance } from 'react-native-appearance';
import {
  defaultMascotPreferences,
  defaultPlanexPreferences,
  defaultPreferences,
  defaultProxiwashPreferences,
  getPreferenceBool,
  getPreferenceObject,
  MascotPreferenceKeys,
  MascotPreferencesType,
  PlanexPreferenceKeys,
  PlanexPreferencesType,
  GeneralPreferenceKeys,
  GeneralPreferencesType,
  ProxiwashPreferenceKeys,
  ProxiwashPreferencesType,
  isValidMascotPreferenceKey,
  PreferencesType,
} from '../utils/asyncStorage';
import {
  getAmicaleServices,
  getINSAServices,
  getSpecialServices,
  getStudentServices,
} from '../utils/Services';
import { useLoginState } from './loginContext';

const colorScheme = Appearance.getColorScheme();

export type PreferencesContextType<
  T extends Partial<PreferencesType>,
  K extends string
> = {
  preferences: T;
  updatePreferences: (
    key: K,
    value: number | string | boolean | object | Array<any>
  ) => void;
  resetPreferences: () => void;
};

// CONTEXTES
// Preferences are separated into several contextes to improve performances

export const PreferencesContext = React.createContext<
  PreferencesContextType<GeneralPreferencesType, GeneralPreferenceKeys>
>({
  preferences: defaultPreferences,
  updatePreferences: () => undefined,
  resetPreferences: () => undefined,
});

export const PlanexPreferencesContext = React.createContext<
  PreferencesContextType<PlanexPreferencesType, PlanexPreferenceKeys>
>({
  preferences: defaultPlanexPreferences,
  updatePreferences: () => undefined,
  resetPreferences: () => undefined,
});

export const ProxiwashPreferencesContext = React.createContext<
  PreferencesContextType<ProxiwashPreferencesType, ProxiwashPreferenceKeys>
>({
  preferences: defaultProxiwashPreferences,
  updatePreferences: () => undefined,
  resetPreferences: () => undefined,
});

export const MascotPreferencesContext = React.createContext<
  PreferencesContextType<MascotPreferencesType, MascotPreferenceKeys>
>({
  preferences: defaultMascotPreferences,
  updatePreferences: () => undefined,
  resetPreferences: () => undefined,
});

// Context Hooks

export function usePreferences() {
  return useContext(PreferencesContext);
}

export function usePlanexPreferences() {
  return useContext(PlanexPreferencesContext);
}

export function useProxiwashPreferences() {
  return useContext(ProxiwashPreferencesContext);
}

export function useMascotPreferences() {
  return useContext(MascotPreferencesContext);
}

// Custom Hooks

export function useShouldShowMascot(route: string) {
  const { preferences, updatePreferences } = useMascotPreferences();
  const key = route + 'ShowMascot';
  let shouldShow = false;
  if (isValidMascotPreferenceKey(key)) {
    shouldShow = getPreferenceBool(key, preferences) !== false;
  }

  const setShouldShow = (show: boolean) => {
    if (isValidMascotPreferenceKey(key)) {
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
    (getPreferenceBool(GeneralPreferenceKeys.nightMode, preferences) !==
      false &&
      (getPreferenceBool(
        GeneralPreferenceKeys.nightModeFollowSystem,
        preferences
      ) === false ||
        colorScheme === 'no-preference')) ||
    (getPreferenceBool(
      GeneralPreferenceKeys.nightModeFollowSystem,
      preferences
    ) !== false &&
      colorScheme === 'dark')
  );
}

export function useCurrentDashboard() {
  const { preferences, updatePreferences } = usePreferences();
  const navigation = useNavigation();
  const isLoggedIn = useLoginState();
  const dashboardIdList = getPreferenceObject(
    GeneralPreferenceKeys.dashboardItems,
    preferences
  ) as Array<string>;

  const updateCurrentDashboard = (newList: Array<string>) => {
    updatePreferences(GeneralPreferenceKeys.dashboardItems, newList);
  };

  const allDatasets = [
    ...getAmicaleServices(
      (route, params) => navigation.navigate(route, params),
      isLoggedIn
    ),
    ...getStudentServices((route, params) =>
      navigation.navigate(route, params)
    ),
    ...getINSAServices((route, params) => navigation.navigate(route, params)),
    ...getSpecialServices((route, params) =>
      navigation.navigate(route, params)
    ),
  ];
  return {
    currentDashboard: allDatasets.filter((item) =>
      dashboardIdList.includes(item.key)
    ),
    currentDashboardIdList: dashboardIdList,
    updateCurrentDashboard: updateCurrentDashboard,
  };
}
