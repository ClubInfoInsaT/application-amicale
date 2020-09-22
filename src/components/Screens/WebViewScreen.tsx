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
import WebView from 'react-native-webview';
import {
  Divider,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import {
  Animated,
  BackHandler,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Collapsible} from 'react-navigation-collapsible';
import withCollapsible from '../../utils/withCollapsible';
import MaterialHeaderButtons, {Item} from '../Overrides/CustomHeaderButton';
import {ERROR_TYPE} from '../../utils/WebData';
import ErrorView from './ErrorView';
import BasicLoadingScreen from './BasicLoadingScreen';

type PropsType = {
  navigation: StackNavigationProp<any>;
  theme: ReactNativePaper.Theme;
  url: string;
  collapsibleStack: Collapsible;
  onMessage: (event: {nativeEvent: {data: string}}) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  customJS?: string;
  customPaddingFunction?: null | ((padding: number) => string);
  showAdvancedControls?: boolean;
};

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

/**
 * Class defining a webview screen.
 */
class WebViewScreen extends React.PureComponent<PropsType> {
  static defaultProps = {
    customJS: '',
    showAdvancedControls: true,
    customPaddingFunction: null,
  };

  webviewRef: {current: null | WebView};

  canGoBack: boolean;

  constructor(props: PropsType) {
    super(props);
    this.webviewRef = React.createRef();
    this.canGoBack = false;
  }

  /**
   * Creates header buttons and listens to events after mounting
   */
  componentDidMount() {
    const {props} = this;
    props.navigation.setOptions({
      headerRight: props.showAdvancedControls
        ? this.getAdvancedButtons
        : this.getBasicButton,
    });
    props.navigation.addListener('focus', () => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
    props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      );
    });
  }

  /**
   * Goes back on the webview or on the navigation stack if we cannot go back anymore
   *
   * @returns {boolean}
   */
  onBackButtonPressAndroid = (): boolean => {
    if (this.canGoBack) {
      this.onGoBackClicked();
      return true;
    }
    return false;
  };

  /**
   * Gets header refresh and open in browser buttons
   *
   * @return {*}
   */
  getBasicButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item
          title="refresh"
          iconName="refresh"
          onPress={this.onRefreshClicked}
        />
        <Item
          title={i18n.t('general.openInBrowser')}
          iconName="open-in-new"
          onPress={this.onOpenClicked}
        />
      </MaterialHeaderButtons>
    );
  };

  /**
   * Creates advanced header control buttons.
   * These buttons allows the user to refresh, go back, go forward and open in the browser.
   *
   * @returns {*}
   */
  getAdvancedButtons = () => {
    const {props} = this;
    return (
      <MaterialHeaderButtons>
        <Item
          title="refresh"
          iconName="refresh"
          onPress={this.onRefreshClicked}
        />
        <OverflowMenu
          style={{marginHorizontal: 10}}
          OverflowIcon={
            <MaterialCommunityIcons
              name="dots-vertical"
              size={26}
              color={props.theme.colors.text}
            />
          }>
          <HiddenItem
            title={i18n.t('general.goBack')}
            onPress={this.onGoBackClicked}
          />
          <HiddenItem
            title={i18n.t('general.goForward')}
            onPress={this.onGoForwardClicked}
          />
          <Divider />
          <HiddenItem
            title={i18n.t('general.openInBrowser')}
            onPress={this.onOpenClicked}
          />
        </OverflowMenu>
      </MaterialHeaderButtons>
    );
  };

  /**
   * Gets the loading indicator
   *
   * @return {*}
   */
  getRenderLoading = () => <BasicLoadingScreen isAbsolute />;

  /**
   * Gets the javascript needed to generate a padding on top of the page
   * This adds padding to the body and runs the custom padding function given in props
   *
   * @param padding The padding to add in pixels
   * @returns {string}
   */
  getJavascriptPadding(padding: number): string {
    const {props} = this;
    const customPadding =
      props.customPaddingFunction != null
        ? props.customPaddingFunction(padding)
        : '';
    return `document.getElementsByTagName('body')[0].style.paddingTop = '${padding}px';${customPadding}true;`;
  }

  /**
   * Callback to use when refresh button is clicked. Reloads the webview.
   */
  onRefreshClicked = () => {
    if (this.webviewRef.current != null) {
      this.webviewRef.current.reload();
    }
  };

  onGoBackClicked = () => {
    if (this.webviewRef.current != null) {
      this.webviewRef.current.goBack();
    }
  };

  onGoForwardClicked = () => {
    if (this.webviewRef.current != null) {
      this.webviewRef.current.goForward();
    }
  };

  onOpenClicked = () => {
    const {url} = this.props;
    Linking.openURL(url);
  };

  onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {onScroll} = this.props;
    if (onScroll) {
      onScroll(event);
    }
  };

  /**
   * Injects the given javascript string into the web page
   *
   * @param script The script to inject
   */
  injectJavaScript = (script: string) => {
    if (this.webviewRef.current != null) {
      this.webviewRef.current.injectJavaScript(script);
    }
  };

  render() {
    const {props} = this;
    const {containerPaddingTop, onScrollWithListener} = props.collapsibleStack;
    return (
      <AnimatedWebView
        ref={this.webviewRef}
        source={{uri: props.url}}
        startInLoadingState
        injectedJavaScript={props.customJS}
        javaScriptEnabled
        renderLoading={this.getRenderLoading}
        renderError={() => (
          <ErrorView
            errorCode={ERROR_TYPE.CONNECTION_ERROR}
            onRefresh={this.onRefreshClicked}
          />
        )}
        onNavigationStateChange={(navState: {canGoBack: boolean}) => {
          this.canGoBack = navState.canGoBack;
        }}
        onMessage={props.onMessage}
        onLoad={() => {
          this.injectJavaScript(this.getJavascriptPadding(containerPaddingTop));
        }}
        // Animations
        onScroll={(event) => onScrollWithListener(this.onScroll)(event)}
      />
    );
  }
}

export default withCollapsible(withTheme(WebViewScreen));
