// @flow

import * as React from 'react';
import SideMenu from "react-native-side-menu";
import SideBar from "./Sidebar";
import {View} from "react-native";


type Props = {
    navigation: Object,
    children: React.Node,
    isOpen: boolean,
    onChange: Function,
}

type State = {
    shouldShowMenu: boolean, // Prevent menu from showing in transitions between tabs
}

export default class CustomSideMenu extends React.Component<Props, State> {

    state = {
        shouldShowMenu: this.props.isOpen,
    };

    // Stop the side menu from being shown while tab transition is playing
    // => Hide the menu when behind the actual screen
    onMenuMove(percent: number) {
        if (percent <= 0)
            this.setState({shouldShowMenu: false});
        else if (this.state.shouldShowMenu === false)
            this.setState({shouldShowMenu: true});
    }

    render() {
        return (
            <SideMenu menu={
                this.state.shouldShowMenu ?
                    <SideBar navigation={this.props.navigation}/>
                    : <View/>}
                      isOpen={this.props.isOpen}
                      onChange={this.props.onChange}
                      onSliding={(percent) => this.onMenuMove(percent)}>
                {this.props.children}
            </SideMenu>
        );
    }
}
