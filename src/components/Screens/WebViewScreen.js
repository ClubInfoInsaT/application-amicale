// @flow

import * as React from 'react';
import WebView from "react-native-webview";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";
import ErrorView from "../Custom/ErrorView";
import {ERROR_TYPE} from "../../utils/WebData";
import MaterialHeaderButtons, {Item} from '../Custom/HeaderButton';

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

    constructor() {
        super();
        this.webviewRef = React.createRef();
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
        return (
            <MaterialHeaderButtons>
                <Item title="refresh" iconName="refresh" onPress={this.onRefreshClicked}/>
            </MaterialHeaderButtons>
        );
    };

    /**
     * Callback to use when refresh button is clicked. Reloads the webview.
     */
    onRefreshClicked = () => this.webviewRef.current.reload();

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
                source={{uri: this.props.data[0]['url']}}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                startInLoadingState={true}
                injectedJavaScript={this.props.data[0]['customJS']}
                javaScriptEnabled={true}
                renderLoading={this.getRenderLoading}
                renderError={() => <ErrorView
                    errorCode={ERROR_TYPE.CONNECTION_ERROR}
                    onRefresh={this.onRefreshClicked}
                />}
            />
        );
    }
}

export default WebViewScreen;
