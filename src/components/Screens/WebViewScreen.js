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
import {Animated, BackHandler} from "react-native";
import {withCollapsible} from "../../utils/withCollapsible";

type Props = {
    navigation: Object,
    url: string,
    customJS: string,
    collapsibleStack: Object,
    onMessage: Function,
}

const AnimatedWebView = Animated.createAnimatedComponent(WebView);

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
    onRefreshClicked = () => this.webviewRef.current.getNode().reload(); // Need to call getNode() as we are working with animated components
    onGoBackClicked = () => this.webviewRef.current.getNode().goBack();
    onGoForwardClicked = () => this.webviewRef.current.getNode().goForward();

    onOpenClicked = () => Linking.openURL(this.props.url);

    postMessage = (message: string) => {
        this.webviewRef.current.getNode().postMessage(message);
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading = () => <BasicLoadingScreen isAbsolute={true}/>;

// document.getElementsByTagName('body')[0].style.paddingTop = '100px';

// $( 'body *' ).filter(function(){
//   var position = $(this).css('position');
//   var top = $(this).css('top');
//   if((position === 'fixed') && top !== 'auto'){
//     console.log(top);
//     $(this).css('top', 'calc(' + top + ' + 100px)');
//     console.log($(this).css('top'));
//   };
// });

// document.querySelectorAll('body *').forEach(function(node){
//   var style = window.getComputedStyle(node);
//   var position = style.getPropertyValue('position');
//   var top = style.getPropertyValue('top');
//   if((position === 'fixed') && top !== 'auto'){
//     console.log(top);
//     node.style.top = 'calc(' + top + ' + 100px)';
//     console.log(node.style.top);
//   	console.log(node);
//   };
// });

    getJavascriptPadding(padding: number) {
        return (
            "document.getElementsByTagName('body')[0].style.paddingTop = '" + padding + "px';\n" +
            "true;"
        );
    }

    render() {
        const {containerPaddingTop, onScroll} = this.props.collapsibleStack;
        const customJS = this.getJavascriptPadding(containerPaddingTop);
        return (
            <AnimatedWebView
                ref={this.webviewRef}
                source={{uri: this.props.url}}
                startInLoadingState={true}
                injectedJavaScript={this.props.customJS + customJS}
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
                // Animations
                onScroll={onScroll}
            />
        );
    }
}

export default withCollapsible(WebViewScreen);
