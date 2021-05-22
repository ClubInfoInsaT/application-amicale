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
import ConnectionManager from './src/managers/ConnectionManager';
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

// Native optimizations https://reactnavigation.org/docs/react-native-screens
// Crashes app when navigating away from webview on android 9+
// enableScreens(true);

LogBox.ignoreLogs([
  // collapsible headers cause this warning, just ignore as it is not an issue
  'Non-serializable values were found in the navigation state',
  'Cannot update a component from inside the function body of a different component',
]);

// TODO move preferences in smaller contextes for improved performances

type StateType = {
  isLoading: boolean;
  initialPreferences: {
    general: GeneralPreferencesType;
    planex: PlanexPreferencesType;
    proxiwash: ProxiwashPreferencesType;
    mascot: MascotPreferencesType;
  };
};

export default class App extends React.Component<{}, StateType> {
  navigatorRef: { current: null | NavigationContainerRef };

  defaultHomeRoute: string | undefined;

  defaultHomeData: { [key: string]: string } | undefined;

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
    };
    initLocales();
    this.navigatorRef = React.createRef();
    this.defaultHomeRoute = undefined;
    this.defaultHomeData = undefined;
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
    this.defaultHomeRoute = parsedData.route;
    this.defaultHomeData = parsedData.data;
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
      nav.navigate('home', {
        screen: 'index',
        params: { nextScreen: parsedData.route, data: parsedData.data },
      });
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
      | void
    >
  ) => {
    const [general, planex, proxiwash, mascot] = values;
    this.setState({
      isLoading: false,
      initialPreferences: {
        general: general as GeneralPreferencesType,
        planex: planex as PlanexPreferencesType,
        proxiwash: proxiwash as ProxiwashPreferencesType,
        mascot: mascot as MascotPreferencesType,
      },
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
      ConnectionManager.getInstance().recoverLogin(),
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
              <MainApp
                ref={this.navigatorRef}
                defaultHomeData={this.defaultHomeData}
                defaultHomeRoute={this.defaultHomeRoute}
              />
            </MascotPreferencesProvider>
          </ProxiwashPreferencesProvider>
        </PlanexPreferencesProvider>
      </GeneralPreferencesProvider>
    );
  }
}
