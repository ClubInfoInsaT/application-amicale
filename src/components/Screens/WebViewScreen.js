// @flow

import * as React from 'react';
import WebView from "react-native-webview";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";
import ErrorView from "../Custom/ErrorView";
import {ERROR_TYPE} from "../../utils/WebData";
import MaterialHeaderButtons, {Item} from '../Custom/HeaderButton';
import {HiddenItem} from "react-navigation-header-buttons";
import {Linking} from "expo";
import i18n from 'i18n-js';
import {BackHandler} from "react-native";

type Props = {
    navigation: Object,
    url: string,
    customJS: string,
}

/**
 * Class defining a webview screen.
 */
class WebViewScreen extends React.PureComponent<Props> {

    static defaultProps = {
        customJS: '',
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
        const rightButton = this.getRefreshButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
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
        if (this.canGoBack){
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
    getRefreshButton() {
        return (
            <MaterialHeaderButtons>
                <Item
                    title="refresh"
                    iconName="refresh"
                    onPress={this.onRefreshClicked}/>
                <HiddenItem
                    title={i18n.t("general.goBack")}
                    iconName="arrow-left"
                    onPress={this.onGoBackClicked}/>
                <HiddenItem
                    title={i18n.t("general.goForward")}
                    iconName="arrow-right"
                    onPress={this.onGoForwardClicked}/>
                <HiddenItem
                    title={i18n.t("general.openInBrowser")}
                    iconName="web"
                    onPress={this.onOpenClicked}/>
            </MaterialHeaderButtons>
        );
    };

    /**
     * Callback to use when refresh button is clicked. Reloads the webview.
     */
    onRefreshClicked = () => this.webviewRef.current.reload();
    onGoBackClicked = () => this.webviewRef.current.goBack();
    onGoForwardClicked = () => this.webviewRef.current.goForward();

    onOpenClicked = () => Linking.openURL(this.props.url);

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading = () => <BasicLoadingScreen/>;

    render() {
        return (
            <WebView
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
            />
        );
    }
}

export default WebViewScreen;
