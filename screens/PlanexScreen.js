// @flow

import * as React from 'react';
import {Platform, View} from 'react-native';
import {Spinner} from 'native-base';
import WebView from "react-native-webview";
import Touchable from "react-native-platform-touchable";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import BaseContainer from "../components/BaseContainer";

type Props = {
    navigation: Object,
}


const PLANEX_URL = 'http://planex.insa-toulouse.fr/';

const CUSTOM_CSS_LINK = 'https://srv-falcon.etud.insa-toulouse.fr/~vergnet/appli-amicale/planex/generalCustom.css';

/**
 * Class defining the app's planex screen.
 * This screen uses a webview to render the planex page
 */
export default class PlanningScreen extends React.Component<Props> {

    webview: WebView;
    customInjectedJS: string;

    constructor() {
        super();
        this.customInjectedJS =
            'document.querySelector(\'head\').innerHTML += \'<meta name="viewport" content="width=device-width, initial-scale=1.0">\';' +
            'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="https://srv-falcon.etud.insa-toulouse.fr/~vergnet/appli-amicale/planex/customMobile.css" type="text/css"/>\';';
        if (ThemeManager.getNightMode())
            this.customInjectedJS += 'document.querySelector(\'head\').innerHTML += \'<link rel="stylesheet" href="https://srv-falcon.etud.insa-toulouse.fr/~vergnet/appli-amicale/planex/customDark.css" type="text/css"/>\';';
    }


    getRefreshButton() {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => this.refreshWebview()}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon="refresh"/>
            </Touchable>
        );
    };

    refreshWebview() {
        this.webview.reload();
    }

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer navigation={nav} headerTitle={'Planex'} headerRightButton={this.getRefreshButton()}>
                <WebView
                    ref={ref => (this.webview = ref)}
                    source={{uri: PLANEX_URL}}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    startInLoadingState={true}
                    injectedJavaScript={this.customInjectedJS}
                    javaScriptEnabled={true}
                    renderLoading={() =>
                        <View style={{
                            backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                            position: 'absolute',
                            top: 0,
                            right: 0,
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

