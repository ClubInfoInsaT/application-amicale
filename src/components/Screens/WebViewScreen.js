// @flow

import * as React from 'react';
import WebView from 'react-native-webview';
import {
  Divider,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import {Animated, BackHandler, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Collapsible} from 'react-navigation-collapsible';
import type {CustomThemeType} from '../../managers/ThemeManager';
import withCollapsible from '../../utils/withCollapsible';
import MaterialHeaderButtons, {Item} from '../Overrides/CustomHeaderButton';
import {ERROR_TYPE} from '../../utils/WebData';
import ErrorView from './ErrorView';
import BasicLoadingScreen from './BasicLoadingScreen';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomThemeType,
  url: string,
  collapsibleStack: Collapsible,
  onMessage: (event: {nativeEvent: {data: string}}) => void,
  onScroll: (event: SyntheticEvent<EventTarget>) => void,
  customJS?: string,
  customPaddingFunction?: null | ((padding: number) => string),
  showAdvancedControls?: boolean,
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

  constructor() {
    super();
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
  getBasicButton = (): React.Node => {
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
  getAdvancedButtons = (): React.Node => {
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
  getRenderLoading = (): React.Node => <BasicLoadingScreen isAbsolute />;

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
    if (this.webviewRef.current != null) this.webviewRef.current.reload();
  };

  onGoBackClicked = () => {
    if (this.webviewRef.current != null) this.webviewRef.current.goBack();
  };

  onGoForwardClicked = () => {
    if (this.webviewRef.current != null) this.webviewRef.current.goForward();
  };

  onOpenClicked = () => {
    const {url} = this.props;
    Linking.openURL(url);
  };

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    const {onScroll} = this.props;
    if (onScroll) onScroll(event);
  };

  /**
   * Injects the given javascript string into the web page
   *
   * @param script The script to inject
   */
  injectJavaScript = (script: string) => {
    if (this.webviewRef.current != null)
      this.webviewRef.current.injectJavaScript(script);
  };

  render(): React.Node {
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
        renderError={(): React.Node => (
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
        onScroll={onScrollWithListener(this.onScroll)}
      />
    );
  }
}

export default withCollapsible(withTheme(WebViewScreen));
