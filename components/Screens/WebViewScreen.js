// @flow

import * as React from 'react';
import WebView from "react-native-webview";
import {withTheme} from 'react-native-paper';
import HeaderButton from "../Custom/HeaderButton";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";

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
    getRenderLoading: Function;

    colors: Object;

    constructor(props) {
        super(props);
        this.onRefreshClicked = this.onRefreshClicked.bind(this);
        this.onWebviewRef = this.onWebviewRef.bind(this);
        this.getRenderLoading = this.getRenderLoading.bind(this);
        this.colors = props.theme.colors;
    }

    /**
     * Creates refresh button after mounting
     */
    componentDidMount() {
        const rightButton = this.getRefreshButton.bind(this);
        this.props.navigation.setOptions({
            headerRight: rightButton,
        });
    }

    /**
     * Gets a header refresh button
     *
     * @return {*}
     */
    getRefreshButton() {
        return <HeaderButton icon={'refresh'} onPress={this.onRefreshClicked}/>
    };

    /**
     * Callback to use when refresh button is clicked. Reloads the webview.
     */
    onRefreshClicked() {
        if (this.webviewRef !== null)
            this.webviewRef.reload();
    }

    /**
     * Callback used when receiving the webview ref. Stores the ref for later use
     *
     * @param ref
     */
    onWebviewRef(ref: Object) {
        this.webviewRef = ref
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading() {
        return <BasicLoadingScreen/>;
    }

    render() {
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
