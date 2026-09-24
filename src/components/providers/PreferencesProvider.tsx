import React, { useState } from 'react';
import {
  defaultMascotPreferences,
  defaultPlanexPreferences,
  defaultPreferences,
  defaultProxiwashPreferences,
  GeneralPreferenceKeys,
  GeneralPreferencesType,
  MascotPreferenceKeys,
  MascotPreferencesType,
  PlanexPreferenceKeys,
  PlanexPreferencesType,
  PreferenceKeys,
  PreferencesType,
  ProxiwashPreferenceKeys,
  ProxiwashPreferencesType,
  setPreference,
} from '../../utils/asyncStorage';
import {
  MascotPreferencesContext,
  PlanexPreferencesContext,
  PreferencesContext,
  PreferencesContextType,
  ProxiwashPreferencesContext,
} from '../../context/preferencesContext';

function updateState<T extends Partial<PreferencesType>, K extends string>(
  key: K,
  value: number | string | boolean | object | Array<any>,
  prevState: PreferencesContextType<T, K>
) {
  const prevPreferences = { ...prevState.preferences };
  const newPrefs = setPreference(key as PreferenceKeys, value, prevPreferences);
  const newSate = {
    ...prevState,
    preferences: { ...newPrefs },
  };
  return newSate;
}

function resetState<
  T extends Partial<PreferencesType>,
  K extends Partial<PreferenceKeys>
>(
  keys: Array<PreferenceKeys>,
  defaults: T,
  prevState: PreferencesContextType<T, K>
) {
  const prevPreferences = { ...prevState.preferences };
  let newPreferences = { ...prevPreferences };
  keys.forEach((key) => {
    newPreferences = setPreference(key, defaults[key], prevPreferences);
  });
  const newSate = {
    ...prevState,
    preferences: { ...newPreferences },
  };
  return newSate;
}

function usePreferencesProvider<
  T extends Partial<PreferencesType>,
  K extends Partial<PreferenceKeys>
>(initialPreferences: T, defaults: T, keys: Array<K>) {
  const updatePreferences = (
    key: K,
    value: number | string | boolean | object | Array<any>
  ) => {
    setPreferencesState((prevState) => updateState(key, value, prevState));
  };

  const resetPreferences = () => {
    setPreferencesState((prevState) => resetState(keys, defaults, prevState));
  };

  const [preferencesState, setPreferencesState] = useState<
    PreferencesContextType<T, K>
  >({
    preferences: { ...initialPreferences },
    updatePreferences: updatePreferences,
    resetPreferences: resetPreferences,
  });
  return preferencesState;
}

type PreferencesProviderProps<
  T extends Partial<PreferencesType>,
  K extends Partial<PreferenceKeys>
> = {
  children: React.ReactChild;
  initialPreferences: T;
  defaults: T;
  keys: Array<K>;
  Context: React.Context<PreferencesContextType<T, K>>;
};

function PreferencesProvider<
  T extends Partial<PreferencesType>,
  K extends Partial<PreferenceKeys>
>(props: PreferencesProviderProps<T, K>) {
  const { Context } = props;
  const preferencesState = usePreferencesProvider<T, K>(
    props.initialPreferences,
    props.defaults,
    Object.values(props.keys)
  );
  return (
    <Context.Provider value={preferencesState}>
      {props.children}
    </Context.Provider>
  );
}

type Props<T> = {
  children: React.ReactChild;
  initialPreferences: T;
};

export function GeneralPreferencesProvider(
  props: Props<GeneralPreferencesType>
) {
  return (
    <PreferencesProvider
      Context={PreferencesContext}
      initialPreferences={props.initialPreferences}
      defaults={defaultPreferences}
      keys={Object.values(GeneralPreferenceKeys)}
    >
      {props.children}
    </PreferencesProvider>
  );
}

export function PlanexPreferencesProvider(props: Props<PlanexPreferencesType>) {
  return (
    <PreferencesProvider
      Context={PlanexPreferencesContext}
      initialPreferences={props.initialPreferences}
      defaults={defaultPlanexPreferences}
      keys={Object.values(PlanexPreferenceKeys)}
    >
      {props.children}
    </PreferencesProvider>
  );
}

export function ProxiwashPreferencesProvider(
  props: Props<ProxiwashPreferencesType>
) {
  return (
    <PreferencesProvider
      Context={ProxiwashPreferencesContext}
      initialPreferences={props.initialPreferences}
      defaults={defaultProxiwashPreferences}
      keys={Object.values(ProxiwashPreferenceKeys)}
    >
      {props.children}
    </PreferencesProvider>
  );
}

export function MascotPreferencesProvider(props: Props<MascotPreferencesType>) {
  return (
    <PreferencesProvider
      Context={MascotPreferencesContext}
      initialPreferences={props.initialPreferences}
      defaults={defaultMascotPreferences}
      keys={Object.values(MascotPreferenceKeys)}
    >
      {props.children}
    </PreferencesProvider>
  );
}
