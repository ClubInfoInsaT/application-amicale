// @flow

import * as React from 'react';
import {Container, Right} from "native-base";
import CustomHeader from "./CustomHeader";
import CustomSideMenu from "./CustomSideMenu";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {Platform, View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import Touchable from "react-native-platform-touchable";


type Props = {
    navigation: Object,
    headerTitle: string,
    headerRightButton: React.Node,
    children: React.Node,
    hasTabs: boolean,
    hasBackButton: boolean,
    hasSideMenu: boolean,
    isHeaderVisible: boolean
}

type State = {
    isOpen: boolean
}


export default class BaseContainer extends React.Component<Props, State> {

    willBlurSubscription: function;

    static defaultProps = {
        headerRightButton: <View/>,
        hasTabs: false,
        hasBackButton: false,
        hasSideMenu: true,
        isHeaderVisible: true,
    };


    state = {
        isOpen: false,
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen: boolean) {
        this.setState({isOpen});
    }

    /**
     * Register for blur event to close side menu on screen change
     */
    componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.setState({isOpen: false});
            }
        );
    }

    /**
     * Unregister from event when un-mounting components
     */
    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
    }

    getMainContainer() {
        return (
            <Container>
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
                {this.props.children}
            </Container>
        );
    }


    render() {
        if (this.props.isHeaderVisible) {
            return (
                <View style={{
                    backgroundColor: ThemeManager.getCurrentThemeVariables().sideMenuBgColor,
                    width: '100%',
                    height: '100%'
                }}>
                    {this.props.hasSideMenu ?
                        <CustomSideMenu
                            navigation={this.props.navigation} isOpen={this.state.isOpen}
                            onChange={(isOpen) => this.updateMenuState(isOpen)}>
                            {this.getMainContainer()}
                        </CustomSideMenu> :
                        this.getMainContainer()}
                </View>
            );
        } else {
            return (
                <View style={{
                    backgroundColor: ThemeManager.getCurrentThemeVariables().sideMenuBgColor,
                    width: '100%',
                    height: '100%'
                }}>
                    {this.props.children}
                </View>
            );
        }

    }
}
