// @flow

import * as React from 'react';
import {Container} from "native-base";
import CustomHeader from "./CustomHeader";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Platform, StatusBar, View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";
import {ScreenOrientation} from "expo";
import {NavigationActions} from "react-navigation";


type Props = {
    navigation: Object,
    headerTitle: string,
    headerRightButton: React.Node,
    children: React.Node,
    hasTabs: boolean,
    hasBackButton: boolean,
    hasSideMenu: boolean,
    enableRotation: boolean,
    hideHeaderOnLandscape: boolean,
}

type State = {
    isHeaderVisible: boolean
}


export default class BaseContainer extends React.Component<Props, State> {

    static defaultProps = {
        headerRightButton: <View/>,
        hasTabs: false,
        hasBackButton: false,
        hasSideMenu: true,
        enableRotation: false,
        hideHeaderOnLandscape: false,
    };
    willBlurSubscription: function;
    willFocusSubscription: function;
    state = {
        isHeaderVisible: true,
    };

    toggle() {
        this.props.navigation.toggleDrawer();
    }
    /**
     * Register for blur event to close side menu on screen change
     */
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                if (this.props.enableRotation) {
                    ScreenOrientation.unlockAsync();
                    ScreenOrientation.addOrientationChangeListener((OrientationChangeEvent) => {
                        if (this.props.hideHeaderOnLandscape) {
                            let isLandscape = OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE ||
                                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                                OrientationChangeEvent.orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
                            this.setState({isHeaderVisible: !isLandscape});
                            const setParamsAction = NavigationActions.setParams({
                                params: {showTabBar: !isLandscape},
                                key: this.props.navigation.state.key,
                            });
                            this.props.navigation.dispatch(setParamsAction);
                            StatusBar.setHidden(isLandscape);
                        }
                    });
                }
            });
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            () => {
                if (this.props.enableRotation)
                    ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
            }
        );
    }

    /**
     * Unregister from event when un-mounting components
     */
    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
        if (this.willFocusSubscription !== undefined)
            this.willFocusSubscription.remove();
    }

    getMainContainer() {
        return (
            <Container>
                {this.state.isHeaderVisible ?
                    <CustomHeader
                        navigation={this.props.navigation} title={this.props.headerTitle}
                        leftButton={
                            <Touchable
                                style={{padding: 6}}
                                onPress={() => this.toggle()}>
                                <CustomMaterialIcon
                                    color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                                    icon="menu"/>
                            </Touchable>
                        }
                        rightButton={this.props.headerRightButton}
                        hasTabs={this.props.hasTabs}
                        hasBackButton={this.props.hasBackButton}/>
                    : <View/>}
                {this.props.children}
            </Container>
        );
    }


    render() {
        return (this.getMainContainer());
    }
}
