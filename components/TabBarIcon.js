import React from 'react';
import {Ionicons} from '@expo/vector-icons/build/Icons';

export default class TabBarIcon extends React.Component {
    render() {
        return (
            <Ionicons
                name={this.props.name}
                size={26}
                style={{marginBottom: -3}}
                color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
        );
    }

}
