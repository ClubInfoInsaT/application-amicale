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
  defaultPreferences,
  PreferenceKeys,
  retrievePreferences,
} from './src/utils/asyncStorage';
import PreferencesProvider from './src/components/providers/PreferencesProvider';
import MainApp from './src/screens/MainApp';

// Native optimizations https://reactnavigation.org/docs/react-native-screens
// Crashes app when navigating away from webview on android 9+
// enableScreens(true);

LogBox.ignoreLogs([
  // collapsible headers cause this warning, just ignore as it is not an issue
  'Non-serializable values were found in the navigation state',
  'Cannot update a component from inside the function body of a different component',
]);

type StateType = {
  isLoading: boolean;
};

export default class App extends React.Component<{}, StateType> {
  navigatorRef: { current: null | NavigationContainerRef };

  defaultHomeRoute: string | null;

  defaultHomeData: { [key: string]: string };

  urlHandler: URLHandler;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
    };
    initLocales();
    this.navigatorRef = React.createRef();
    this.defaultHomeRoute = null;
    this.defaultHomeData = {};
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
  onLoadFinished = () => {
    this.setState({
      isLoading: false,
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
      retrievePreferences(Object.values(PreferenceKeys), defaultPreferences),
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
      <PreferencesProvider initialPreferences={defaultPreferences}>
        <MainApp
          ref={this.navigatorRef}
          defaultHomeData={this.defaultHomeData}
          defaultHomeRoute={this.defaultHomeRoute}
        />
      </PreferencesProvider>
    );
  }
}
