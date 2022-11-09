/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import { LogBox, Platform } from 'react-native';
import { setSafeBounceHeight } from 'react-navigation-collapsible';
import SplashScreen from 'react-native-splash-screen';
import type { ParsedUrlDataType } from './src/utils/URLHandler';
import URLHandler from './src/utils/URLHandler';
import initLocales from './src/utils/Locales';
import { NavigationContainerRef } from '@react-navigation/core';
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
  ProxiwashPreferenceKeys,
  ProxiwashPreferencesType,
  retrievePreferences,
} from './src/utils/asyncStorage';
import {
  GeneralPreferencesProvider,
  MascotPreferencesProvider,
  PlanexPreferencesProvider,
  ProxiwashPreferencesProvider,
} from './src/components/providers/PreferencesProvider';
import MainApp from './src/screens/MainApp';
import LoginProvider from './src/components/providers/LoginProvider';
import { retrieveLoginToken } from './src/utils/loginToken';

initLocales();

LogBox.ignoreLogs([
  'Cannot update a component from inside the function body of a different component',
  '`new NativeEventEmitter()` was called with a non-null argument',
]);

type StateType = {
  isLoading: boolean;
  initialPreferences: {
    general: GeneralPreferencesType;
    planex: PlanexPreferencesType;
    proxiwash: ProxiwashPreferencesType;
    mascot: MascotPreferencesType;
  };
  loginToken?: string;
};

export default class App extends React.Component<{}, StateType> {
  navigatorRef: { current: null | NavigationContainerRef<any> };

  defaultData?: ParsedUrlDataType;

  urlHandler: URLHandler;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      initialPreferences: {
        general: defaultPreferences,
        planex: defaultPlanexPreferences,
        proxiwash: defaultProxiwashPreferences,
        mascot: defaultMascotPreferences,
      },
      loginToken: undefined,
    };
    this.navigatorRef = React.createRef();
    this.defaultData = undefined;
    this.urlHandler = new URLHandler(this.onInitialURLParsed, this.onDetectURL);
    this.urlHandler.listen();
    setSafeBounceHeight(Platform.OS === 'ios' ? 100 : 20);
    this.loadAssetsAsync();
  }

  /**
   * The app has been started by an url, and it has been parsed.
   * Set a new default start route based on the data parsed.
   *
   * @param parsedData The data parsed from the url
   */
  onInitialURLParsed = (parsedData: ParsedUrlDataType) => {
    this.defaultData = parsedData;
  };

  /**
   * An url has been opened and parsed while the app was active.
   * Redirect the user to the screen according to parsed data.
   *
   * @param parsedData The data parsed from the url
   */
  onDetectURL = (parsedData: ParsedUrlDataType) => {
    // Navigate to nested navigator and pass data to the index screen
    const nav = this.navigatorRef.current;
    if (nav != null) {
      nav.navigate(parsedData.route, parsedData.data);
    }
  };

  /**
   * Async loading is done, finish processing startup data
   */
  onLoadFinished = (
    values: Array<
      | GeneralPreferencesType
      | PlanexPreferencesType
      | ProxiwashPreferencesType
      | MascotPreferencesType
      | string
      | undefined
    >
  ) => {
    const [general, planex, proxiwash, mascot, token] = values;
    this.setState({
      isLoading: false,
      initialPreferences: {
        general: general as GeneralPreferencesType,
        planex: planex as PlanexPreferencesType,
        proxiwash: proxiwash as ProxiwashPreferencesType,
        mascot: mascot as MascotPreferencesType,
      },
      loginToken: token as string | undefined,
    });
    SplashScreen.hide();
  };

  /**
   * Loads every async data
   *
   * @returns {Promise<void>}
   */
  loadAssetsAsync() {
    Promise.all([
      retrievePreferences(
        Object.values(GeneralPreferenceKeys),
        defaultPreferences
      ),
      retrievePreferences(
        Object.values(PlanexPreferenceKeys),
        defaultPlanexPreferences
      ),
      retrievePreferences(
        Object.values(ProxiwashPreferenceKeys),
        defaultProxiwashPreferences
      ),
      retrievePreferences(
        Object.values(MascotPreferenceKeys),
        defaultMascotPreferences
      ),
      retrieveLoginToken(),
    ])
      .then(this.onLoadFinished)
      .catch(this.onLoadFinished);
  }

  /**
   * Renders the app based on loading state
   */
  render() {
    const { state } = this;
    if (state.isLoading) {
      return null;
    }
    return (
      <GeneralPreferencesProvider
        initialPreferences={this.state.initialPreferences.general}
      >
        <PlanexPreferencesProvider
          initialPreferences={this.state.initialPreferences.planex}
        >
          <ProxiwashPreferencesProvider
            initialPreferences={this.state.initialPreferences.proxiwash}
          >
            <MascotPreferencesProvider
              initialPreferences={this.state.initialPreferences.mascot}
            >
              <LoginProvider initialToken={this.state.loginToken}>
                <MainApp
                  ref={this.navigatorRef}
                  defaultData={this.defaultData}
                />
              </LoginProvider>
            </MascotPreferencesProvider>
          </ProxiwashPreferencesProvider>
        </PlanexPreferencesProvider>
      </GeneralPreferencesProvider>
    );
  }
}
