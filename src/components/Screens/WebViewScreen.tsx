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

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import WebView, { WebViewNavigation } from 'react-native-webview';
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
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { useCollapsibleHeader } from 'react-navigation-collapsible';
import MaterialHeaderButtons, { Item } from '../Overrides/CustomHeaderButton';
import ErrorView from './ErrorView';
import BasicLoadingScreen from './BasicLoadingScreen';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { useCollapsible } from '../../context/CollapsibleContext';
import { REQUEST_STATUS } from '../../utils/Requests';

type Props = {
  url: string;
  onMessage?: (event: { nativeEvent: { data: string } }) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  initialJS?: string;
  injectJS?: string;
  customPaddingFunction?: null | ((padding: number) => string);
  showAdvancedControls?: boolean;
  showControls?: boolean;
};

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

const styles = StyleSheet.create({
  overflow: {
    marginHorizontal: 10,
  },
});

/**
 * Class defining a webview screen.
 */
function WebViewScreen(props: Props) {
  const [navState, setNavState] = useState<undefined | WebViewNavigation>({
    canGoBack: false,
    canGoForward: false,
    loading: true,
    url: props.url,
    lockIdentifier: 0,
    navigationType: 'click',
    title: '',
  });
  const navigation = useNavigation();
  const theme = useTheme();
  const webviewRef = useRef<WebView>();

  const { setCollapsible } = useCollapsible();
  const collapsible = useCollapsibleHeader({
    config: { collapsedColor: theme.colors.surface, useNativeDriver: false },
  });
  const { containerPaddingTop, onScrollWithListener } = collapsible;

  const [currentInjectedJS, setCurrentInjectedJS] = useState(props.injectJS);

  useFocusEffect(
    useCallback(() => {
      setCollapsible(collapsible);
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid
      );
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid
        );
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapsible, setCollapsible])
  );

  useLayoutEffect(() => {
    if (props.showControls !== false) {
      navigation.setOptions({
        headerRight: props.showAdvancedControls
          ? getAdvancedButtons
          : getBasicButton,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigation,
    props.showAdvancedControls,
    navState?.url,
    props.showControls,
  ]);

  useEffect(() => {
    if (props.injectJS && props.injectJS !== currentInjectedJS) {
      injectJavaScript(props.injectJS);
      setCurrentInjectedJS(props.injectJS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.injectJS]);

  const onBackButtonPressAndroid = () => {
    if (navState?.canGoBack) {
      onGoBackClicked();
      return true;
    }
    return false;
  };

  const getBasicButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item
          title={'refresh'}
          iconName={'refresh'}
          onPress={onRefreshClicked}
        />
        <Item
          title={i18n.t('general.openInBrowser')}
          iconName={'open-in-new'}
          onPress={onOpenClicked}
        />
      </MaterialHeaderButtons>
    );
  };

  const getAdvancedButtons = () => {
    return (
      <MaterialHeaderButtons>
        <Item title="refresh" iconName="refresh" onPress={onRefreshClicked} />
        <OverflowMenu
          style={styles.overflow}
          OverflowIcon={
            <MaterialCommunityIcons
              name="dots-vertical"
              size={26}
              color={theme.colors.text}
            />
          }
        >
          <HiddenItem
            title={i18n.t('general.goBack')}
            onPress={onGoBackClicked}
          />
          <HiddenItem
            title={i18n.t('general.goForward')}
            onPress={onGoForwardClicked}
          />
          <Divider />
          <HiddenItem
            title={i18n.t('general.openInBrowser')}
            onPress={onOpenClicked}
          />
        </OverflowMenu>
      </MaterialHeaderButtons>
    );
  };

  const getRenderLoading = () => <BasicLoadingScreen isAbsolute={true} />;

  /**
   * Gets the javascript needed to generate a padding on top of the page
   * This adds padding to the body and runs the custom padding function given in props
   *
   * @param padding The padding to add in pixels
   * @returns {string}
   */
  const getJavascriptPadding = (padding: number) => {
    const customPadding =
      props.customPaddingFunction != null
        ? props.customPaddingFunction(padding)
        : '';
    return `document.getElementsByTagName('body')[0].style.paddingTop = '${padding}px';${customPadding}true;`;
  };

  const onRefreshClicked = () => {
    //@ts-ignore
    if (webviewRef.current) {
      //@ts-ignore
      webviewRef.current.reload();
    }
  };

  const onGoBackClicked = () => {
    //@ts-ignore
    if (webviewRef.current) {
      //@ts-ignore
      webviewRef.current.goBack();
    }
  };

  const onGoForwardClicked = () => {
    //@ts-ignore
    if (webviewRef.current) {
      //@ts-ignore
      webviewRef.current.goForward();
    }
  };

  const onOpenClicked = () =>
    navState ? Linking.openURL(navState.url) : undefined;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (props.onScroll) {
      props.onScroll(event);
    }
  };

  const injectJavaScript = (script: string) => {
    //@ts-ignore
    if (webviewRef.current) {
      //@ts-ignore
      webviewRef.current.injectJavaScript(script);
    }
  };

  return (
    <AnimatedWebView
      ref={webviewRef}
      source={{ uri: props.url }}
      startInLoadingState={true}
      injectedJavaScript={props.initialJS}
      javaScriptEnabled={true}
      renderLoading={getRenderLoading}
      renderError={() => (
        <ErrorView
          status={REQUEST_STATUS.CONNECTION_ERROR}
          button={{
            icon: 'refresh',
            text: i18n.t('general.retry'),
            onPress: onRefreshClicked,
          }}
        />
      )}
      onNavigationStateChange={setNavState}
      onMessage={props.onMessage}
      onLoad={() => injectJavaScript(getJavascriptPadding(containerPaddingTop))}
      // Animations
      onScroll={onScrollWithListener(onScroll)}
    />
  );
}

export default WebViewScreen;
