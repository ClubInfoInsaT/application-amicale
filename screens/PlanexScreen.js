// @flow

import * as React from 'react';
import {Platform, View} from 'react-native';
import {Container, Right, Spinner} from 'native-base';
import CustomHeader from "../components/CustomHeader";
import WebView from "react-native-webview";
import Touchable from "react-native-platform-touchable";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import BaseContainer from "../components/BaseContainer";

type Props = {
    navigation: Object,
}

type State = {
    isFinishedLoading: boolean
}

// const PLANEX_URL = 'http://planex.insa-toulouse.fr/';
// TODO use real url in prod
const PLANEX_URL = 'https://srv-falcon.etud.insa-toulouse.fr/~vergnet/planex/planex.insa-toulouse.fr.html';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class PlanningScreen extends React.Component<Props, State> {

    state = {
        isFinishedLoading: false,
    };

    webview: WebView;

    getRefreshButton() {
        return (
            <Right>
                <Touchable
                    style={{padding: 6}}
                    onPress={() => this.refreshWebview()}>
                    <CustomMaterialIcon
                        color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                        icon="refresh"/>
                </Touchable>
            </Right>
        );
    };

    refreshWebview() {
        this.setState({isFinishedLoading: false});
        this.webview.reload();
    }

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer navigation={nav} headerTitle={'Planex'} headerRightMenu={this.getRefreshButton()}>
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{uri: PLANEX_URL}}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    startInLoadingState={true}
                    renderLoading={() =>
                        <View style={{
                            backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                            width: '100%',
                            height: '100%',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Spinner/>
                        </View>
                    }
                />
            </BaseContainer>
        );
    }
}

