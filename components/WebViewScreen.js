// @flow

import * as React from 'react';
import {View} from 'react-native';
import WebView from "react-native-webview";
import {ActivityIndicator, withTheme} from 'react-native-paper';
import HeaderButton from "./HeaderButton";

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
class WebViewScreen extends React.PureComponent<Props> {

    static defaultProps = {
        hasBackButton: false,
        hasSideMenu: true,
        hasFooter: true,
    };
    webviewRef: Object;

    onRefreshClicked: Function;
    onWebviewRef: Function;
    onGoBackWebview: Function;
    onGoForwardWebview: Function;
    getRenderLoading: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.onRefreshClicked = this.onRefreshClicked.bind(this);
        this.onWebviewRef = this.onWebviewRef.bind(this);
        this.onGoBackWebview = this.onGoBackWebview.bind(this);
        this.onGoForwardWebview = this.onGoForwardWebview.bind(this);
        this.getRenderLoading = this.getRenderLoading.bind(this);
        this.colors = props.theme.colors;
    }

    componentDidMount() {
        const rightButton = this.getRefreshButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    getHeaderButton(clickAction: Function, icon: string) {
        return (
            <HeaderButton icon={icon} onPress={clickAction}/>
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
        if (this.webviewRef !== null)
            this.webviewRef.reload();
    }

    onGoBackWebview() {
        if (this.webviewRef !== null)
            this.webviewRef.goBack();
    }

    onGoForwardWebview() {
        if (this.webviewRef !== null)
            this.webviewRef.goForward();
    }

    onWebviewRef(ref: Object) {
        this.webviewRef = ref
    }

    getRenderLoading() {
        return (
            <View style={{
                backgroundColor: this.colors.background,
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
                    color={this.colors.primary}/>
            </View>
        );
    }

    render() {
        // console.log("rendering WebViewScreen");
        return (
            <WebView
                ref={this.onWebviewRef}
                source={{uri: this.props.data[0]['url']}}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                startInLoadingState={true}
                injectedJavaScript={this.props.data[0]['customJS']}
                javaScriptEnabled={true}
                renderLoading={this.getRenderLoading}
            />
        );
    }
}

export default withTheme(WebViewScreen);
