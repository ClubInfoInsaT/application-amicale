// @flow

import * as React from 'react';
import WebView from "react-native-webview";
import BasicLoadingScreen from "./BasicLoadingScreen";
import ErrorView from "./ErrorView";
import {ERROR_TYPE} from "../../utils/WebData";
import MaterialHeaderButtons, {Item} from '../Overrides/CustomHeaderButton';
import {Divider, HiddenItem, OverflowMenu} from "react-navigation-header-buttons";
import i18n from 'i18n-js';
import {Animated, BackHandler, Linking} from "react-native";
import {withCollapsible} from "../../utils/withCollapsible";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {withTheme} from "react-native-paper";
import type {CustomTheme} from "../../managers/ThemeManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Collapsible} from "react-navigation-collapsible";

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    url: string,
    customJS: string,
    collapsibleStack: Collapsible,
    onMessage: Function,
    onScroll: Function,
    showAdvancedControls: boolean,
}

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

/**
 * Class defining a webview screen.
 */
class WebViewScreen extends React.PureComponent<Props> {

    static defaultProps = {
        customJS: '',
        showAdvancedControls: true,
    };

    webviewRef: Object;

    canGoBack: boolean;

    constructor() {
        super();
        this.webviewRef = React.createRef();
        this.canGoBack = false;
    }

    /**
     * Creates refresh button after mounting
     */
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: this.props.showAdvancedControls
                ? this.getAdvancedButtons
                : this.getBasicButton,
        });
        this.props.navigation.addListener(
            'focus',
            () =>
                BackHandler.addEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
        this.props.navigation.addListener(
            'blur',
            () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    this.onBackButtonPressAndroid
                )
        );
    }

    onBackButtonPressAndroid = () => {
        if (this.canGoBack) {
            this.onGoBackClicked();
            return true;
        }
        return false;
    };

    /**
     * Gets a header refresh button
     *
     * @return {*}
     */
    getBasicButton = () => {
        return (
            <MaterialHeaderButtons>
                <Item
                    title="refresh"
                    iconName="refresh"
                    onPress={this.onRefreshClicked}/>
                <Item
                    title={i18n.t("general.openInBrowser")}
                    iconName="open-in-new"
                    onPress={this.onOpenClicked}/>
            </MaterialHeaderButtons>
        );
    };

    getAdvancedButtons = () => {
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
                            color={this.props.theme.colors.text}
                        />}
                >
                    <HiddenItem
                        title={i18n.t("general.goBack")}
                        onPress={this.onGoBackClicked}/>
                    <HiddenItem
                        title={i18n.t("general.goForward")}
                        onPress={this.onGoForwardClicked}/>
                    <Divider/>
                    <HiddenItem
                        title={i18n.t("general.openInBrowser")}
                        onPress={this.onOpenClicked}/>
                </OverflowMenu>
            </MaterialHeaderButtons>
        );
    }

    /**
     * Callback to use when refresh button is clicked. Reloads the webview.
     */
    onRefreshClicked = () => this.webviewRef.current.reload();
    onGoBackClicked = () => this.webviewRef.current.goBack();
    onGoForwardClicked = () => this.webviewRef.current.goForward();

    onOpenClicked = () => Linking.openURL(this.props.url);

    injectJavaScript = (script: string) => {
        this.webviewRef.current.injectJavaScript(script);
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading = () => <BasicLoadingScreen isAbsolute={true}/>;

    getJavascriptPadding(padding: number) {
        return (
            "document.getElementsByTagName('body')[0].style.paddingTop = '" + padding + "px';" +
            "true;"
        );
    }

    onScroll = (event: Object) => {
        if (this.props.onScroll)
            this.props.onScroll(event);
    }

    render() {
        const {containerPaddingTop, onScrollWithListener} = this.props.collapsibleStack;
        return (
            <AnimatedWebView
                ref={this.webviewRef}
                source={{uri: this.props.url}}
                startInLoadingState={true}
                injectedJavaScript={this.props.customJS}
                javaScriptEnabled={true}
                renderLoading={this.getRenderLoading}
                renderError={() => <ErrorView
                    errorCode={ERROR_TYPE.CONNECTION_ERROR}
                    onRefresh={this.onRefreshClicked}
                />}
                onNavigationStateChange={navState => {
                    this.canGoBack = navState.canGoBack;
                }}
                onMessage={this.props.onMessage}
                onLoad={() => this.injectJavaScript(this.getJavascriptPadding(containerPaddingTop))}
                // Animations
                onScroll={onScrollWithListener(this.onScroll)}
            />
        );
    }
}

export default withCollapsible(withTheme(WebViewScreen));
