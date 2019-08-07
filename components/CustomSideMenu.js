// @flow

import * as React from 'react';
import SideMenu from "react-native-side-menu";
import SideBar from "./Sidebar";


type Props = {
    navigation: Object,
    children: React.Node,
    isOpen: boolean,
    onChange: Function
}

export default class CustomSideMenu extends React.Component<Props> {
    render() {
        return (
            <SideMenu menu={<SideBar navigation={this.props.navigation}/>}
                      isOpen={this.props.isOpen}
                      onChange={this.props.onChange}>
                {this.props.children}
            </SideMenu>
        );
    }
}
