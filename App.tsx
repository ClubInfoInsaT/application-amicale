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

import * as React from 'react';
import {LogBox, Platform, SafeAreaView, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {setSafeBounceHeight} from 'react-navigation-collapsible';
import SplashScreen from 'react-native-splash-screen';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';
import AsyncStorageManager from './src/managers/AsyncStorageManager';
import CustomIntroSlider from './src/components/Overrides/CustomIntroSlider';
import ThemeManager from './src/managers/ThemeManager';
import MainNavigator from './src/navigation/MainNavigator';
import AprilFoolsManager from './src/managers/AprilFoolsManager';
import Update from './src/constants/Update';
import ConnectionManager from './src/managers/ConnectionManager';
import type {ParsedUrlDataType} from './src/utils/URLHandler';
import URLHandler from './src/utils/URLHandler';
import {setupStatusBar} from './src/utils/Utils';
import initLocales from './src/utils/Locales';
import {NavigationContainerRef} from '@react-navigation/core';

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
  showIntro: boolean;
  showUpdate: boolean;
  showAprilFools: boolean;
  currentTheme: ReactNativePaper.Theme | undefined;
};

export default class App extends React.Component<{}, StateType> {
  navigatorRef: {current: null | NavigationContainerRef};

  defaultHomeRoute: string | null;

  defaultHomeData: {[key: string]: string};

  urlHandler: URLHandler;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      showIntro: true,
      showUpdate: true,
      showAprilFools: false,
      currentTheme: undefined,
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
        params: {nextScreen: parsedData.route, data: parsedData.data},
      });
    }
  };

  /**
   * Updates the current theme
   */
  onUpdateTheme = () => {
    this.setState({
      currentTheme: ThemeManager.getCurrentTheme(),
    });
    setupStatusBar();
  };

  /**
   * Callback when user ends the intro. Save in preferences to avoid showing back the introSlides
   */
  onIntroDone = () => {
    this.setState({
      showIntro: false,
      showUpdate: false,
      showAprilFools: false,
    });
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.showIntro.key,
      false,
    );
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.updateNumber.key,
      Update.number,
    );
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.showAprilFoolsStart.key,
      false,
    );
  };

  /**
   * Async loading is done, finish processing startup data
   */
  onLoadFinished = () => {
    // Only show intro if this is the first time starting the app
    ThemeManager.getInstance().setUpdateThemeCallback(this.onUpdateTheme);
    // Status bar goes dark if set too fast on ios
    if (Platform.OS === 'ios') {
      setTimeout(setupStatusBar, 1000);
    } else {
      setupStatusBar();
    }

    this.setState({
      isLoading: false,
      currentTheme: ThemeManager.getCurrentTheme(),
      showIntro: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.showIntro.key,
      ),
      showUpdate:
        AsyncStorageManager.getNumber(
          AsyncStorageManager.PREFERENCES.updateNumber.key,
        ) !== Update.number,
      showAprilFools:
        AprilFoolsManager.getInstance().isAprilFoolsEnabled() &&
        AsyncStorageManager.getBool(
          AsyncStorageManager.PREFERENCES.showAprilFoolsStart.key,
        ),
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
      AsyncStorageManager.getInstance().loadPreferences(),
      ConnectionManager.getInstance().recoverLogin(),
    ])
      .then(this.onLoadFinished)
      .catch(this.onLoadFinished);
  }

  /**
   * Renders the app based on loading state
   */
  render() {
    const {state} = this;
    if (state.isLoading) {
      return null;
    }
    if (state.showIntro || state.showUpdate || state.showAprilFools) {
      return (
        <CustomIntroSlider
          onDone={this.onIntroDone}
          isUpdate={state.showUpdate && !state.showIntro}
          isAprilFools={state.showAprilFools && !state.showIntro}
        />
      );
    }
    return (
      <PaperProvider theme={state.currentTheme}>
        <OverflowMenuProvider>
          <View
            style={{
              backgroundColor: ThemeManager.getCurrentTheme().colors.background,
              flex: 1,
            }}>
            <SafeAreaView style={{flex: 1}}>
              <NavigationContainer
                theme={state.currentTheme}
                ref={this.navigatorRef}>
                <MainNavigator
                  defaultHomeRoute={this.defaultHomeRoute}
                  defaultHomeData={this.defaultHomeData}
                />
              </NavigationContainer>
            </SafeAreaView>
          </View>
        </OverflowMenuProvider>
      </PaperProvider>
    );
  }
}
