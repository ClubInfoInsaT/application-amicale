// @flow

import * as React from 'react';
import {View} from 'react-native';
import WebView from "react-native-webview";
import Touchable from "react-native-platform-touchable";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ThemeManager from "../utils/ThemeManager";
import {ActivityIndicator} from 'react-native-paper';

type Props = {
    navigation: Object,
    data: Array<{
        url: string,
        icon: string,
        name: string,
        customJS: string
    }>,
    headerTitle: string,
    hasHeaderBackButton: boolean,
    hasSideMenu: boolean,
    hasFooter: boolean,
}

/**
 * Class defining a webview screen.
 */
export default class WebViewScreen extends React.Component<Props> {

    static defaultProps = {
        hasBackButton: false,
        hasSideMenu: true,
        hasFooter: true,
    };
    webviewArray: Array<WebView> = [];

    onRefreshClicked: Function;
    onWebviewRef: Function;
    onGoBackWebview: Function;
    onGoForwardWebview: Function;
    onOpenWebLink: Function;

    constructor() {
        super();
        this.onRefreshClicked = this.onRefreshClicked.bind(this);
        this.onWebviewRef = this.onWebviewRef.bind(this);
        this.onGoBackWebview = this.onGoBackWebview.bind(this);
        this.onGoForwardWebview = this.onGoForwardWebview.bind(this);
        this.onOpenWebLink = this.onOpenWebLink.bind(this);
    }

    componentDidMount() {
        const rightButton = this.getRefreshButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    getHeaderButton(clickAction: Function, icon: string) {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={clickAction}>
                <MaterialCommunityIcons
                    name={icon}
                    size={26}
                    color={ThemeManager.getCurrentThemeVariables().text}/>
            </Touchable>
        );
    }

    getRefreshButton() {
        return (
            <View style={{
                flexDirection: 'row',
                marginRight: 10
            }}>
                {this.getHeaderButton(this.onRefreshClicked, 'refresh')}
            </View>
        );
    };

    onRefreshClicked() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.reload();
        }
    }

    onGoBackWebview() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.goBack();
        }
    }

    onGoForwardWebview() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.goForward();
        }
    }

    onOpenWebLink() {
        this.openWebLink(this.props.data[0]['url'])
    }

    onWebviewRef(ref: WebView) {
        this.webviewArray.push(ref)
    }

    getRenderLoading() {
        return (
            <View style={{
                backgroundColor: ThemeManager.getCurrentThemeVariables().background,
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                    color={ThemeManager.getCurrentThemeVariables().primary}/>
            </View>
        );
    }

    getWebview(obj: Object) {
        return (
            <WebView
                ref={this.onWebviewRef}
                source={{uri: obj['url']}}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                startInLoadingState={true}
                injectedJavaScript={obj['customJS']}
                javaScriptEnabled={true}
                renderLoading={this.getRenderLoading}
            />
        );
    }

    render() {
        // console.log("rendering WebViewScreen");
        this.webviewArray = [];
        return (
            this.getWebview(this.props.data[0])
        );
    }
}

