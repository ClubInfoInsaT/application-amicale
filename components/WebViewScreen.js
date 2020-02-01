// @flow

import * as React from 'react';
import {Linking, Platform, View} from 'react-native';
import {Body, Footer, Left, Right, Spinner, Tab, TabHeading, Tabs, Text} from 'native-base';
import WebView from "react-native-webview";
import Touchable from "react-native-platform-touchable";
import CustomMaterialIcon from "../components/CustomMaterialIcon";
import ThemeManager from "../utils/ThemeManager";
import BaseContainer from "../components/BaseContainer";

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

    openWebLink(url: string) {
        Linking.openURL(url).catch((err) => console.error('Error opening link', err));
    }

    getHeaderButton(clickAction: Function, icon: string) {
        return (
            <Touchable
                style={{padding: 6}}
                onPress={() => clickAction()}>
                <CustomMaterialIcon
                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                    icon={icon}/>
            </Touchable>
        );
    }

    getRefreshButton() {
        return (
            <View style={{flexDirection: 'row'}}>
                {this.getHeaderButton(() => this.refreshWebview(), 'refresh')}
            </View>
        );
    };

    refreshWebview() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.reload();
        }
    }

    goBackWebview() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.goBack();
        }
    }

    goForwardWebview() {
        for (let view of this.webviewArray) {
            if (view !== null)
                view.goForward();
        }
    }

    getWebview(obj: Object) {
        return (
            <WebView
                ref={ref => (this.webviewArray.push(ref))}
                source={{uri: obj['url']}}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                startInLoadingState={true}
                injectedJavaScript={obj['customJS']}
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
        );
    }

    getTabbedWebview() {
        let tabbedView = [];
        for (let i = 0; i < this.props.data.length; i++) {
            tabbedView.push(
                <Tab heading={
                    <TabHeading>
                        <CustomMaterialIcon
                            icon={this.props.data[i]['icon']}
                            color={ThemeManager.getCurrentThemeVariables().tabIconColor}
                            fontSize={20}
                        />
                        <Text>{this.props.data[i]['name']}</Text>
                    </TabHeading>}
                     key={this.props.data[i]['url']}
                     style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                    {this.getWebview(this.props.data[i])}
                </Tab>);
        }
        return tabbedView;
    }

    render() {
        const nav = this.props.navigation;
        this.webviewArray = [];
        return (
            <BaseContainer
                navigation={nav}
                headerTitle={this.props.headerTitle}
                headerRightButton={this.getRefreshButton()}
                hasBackButton={this.props.hasHeaderBackButton}
                hasSideMenu={this.props.hasSideMenu}
                enableRotation={true}
                hideHeaderOnLandscape={true}
                hasTabs={this.props.data.length > 1}>
                {this.props.data.length === 1 ?
                    this.getWebview(this.props.data[0]) :
                    <Tabs
                        tabContainerStyle={{
                            elevation: 0, // Fix for android shadow
                        }}
                        locked={true}
                        style={{
                            backgroundColor: Platform.OS === 'ios' ?
                                ThemeManager.getCurrentThemeVariables().tabDefaultBg :
                                ThemeManager.getCurrentThemeVariables().brandPrimary
                        }}

                    >
                        {this.getTabbedWebview()}
                    </Tabs>}
                {this.props.hasFooter && this.props.data.length === 1 ?
                    <Footer>
                        <Left style={{
                            paddingLeft: 6,
                        }}>
                            {this.getHeaderButton(() => this.openWebLink(this.props.data[0]['url']), 'open-in-new')}
                        </Left>
                        <Body/>
                        <Right style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            paddingRight: 6
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                marginRight: 0,
                                marginLeft: 'auto'
                            }}>
                                {this.getHeaderButton(() => this.goBackWebview(), 'chevron-left')}
                                {this.getHeaderButton(() => this.goForwardWebview(), 'chevron-right')}
                            </View>
                        </Right>
                    </Footer> : <View/>}
            </BaseContainer>
        );
    }
}

