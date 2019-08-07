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
    children: React.Node
}

type State = {
    isOpen: boolean
}


export default class BaseContainer extends React.Component<Props, State> {

    static defaultProps = {
        headerRightMenu: <Right/>
    };


    state = {
        isOpen: false,
    };

    toggle() {
        console.log('coucou');
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen: boolean) {

        this.setState({isOpen});
    }

    render() {
        return (
            <CustomSideMenu navigation={this.props.navigation} isOpen={this.state.isOpen}
                            onChange={(isOpen) => this.updateMenuState(isOpen)}>
                <Container>
                    <CustomHeader navigation={this.props.navigation} title={this.props.headerTitle}
                                  leftButton={
                                      <Touchable
                                          style={{padding: 6}}
                                          onPress={() => this.toggle()}>
                                          <CustomMaterialIcon
                                              color={Platform.OS === 'ios' ? ThemeManager.getCurrentThemeVariables().brandPrimary : "#fff"}
                                              icon="menu"/>
                                      </Touchable>
                                  }
                    rightButton={this.props.headerRightButton}/>
                    {this.props.children}
                </Container>
            </CustomSideMenu>
        );
    }
}
