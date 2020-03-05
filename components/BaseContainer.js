// @flow

import * as React from 'react';
import {Container} from "native-base";
import CustomHeader from "./CustomHeader";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Platform, View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";


type Props = {
    navigation: Object,
    headerTitle: string,
    headerSubtitle: string,
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
        headerSubtitle: '',
    };

    state = {
        isHeaderVisible: true,
    };

    onDrawerPress: Function;

    constructor() {
        super();
        this.onDrawerPress = this.onDrawerPress.bind(this);
    }

    onDrawerPress() {
        this.props.navigation.toggleDrawer();
    }

    render() {
        // console.log("rendering BaseContainer");
        return (
            <Container>
                {this.state.isHeaderVisible ?
                    <CustomHeader
                        navigation={this.props.navigation}
                        title={this.props.headerTitle}
                        subtitle={this.props.headerSubtitle}
                        leftButton={
                            <Touchable
                                style={{padding: 6}}
                                onPress={this.onDrawerPress}>
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
}
