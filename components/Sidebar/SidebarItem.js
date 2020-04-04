import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {DrawerItem} from "@react-navigation/drawer";
import {MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * Component used to render a drawer menu item
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function SidebarItem(props) {
    const {colors} = props.theme;
    return (
        <DrawerItem
            label={props.title}
            focused={false}
            onPress={props.onPress}
            icon={({color, size}) =>
                <MaterialCommunityIcons color={props.shouldEmphasis ? colors.primary : color} size={size} name={props.icon}/>}
            style={{
                marginLeft: 0,
                marginRight: 0,
                padding: 0,
                borderRadius: 0,
            }}
            labelStyle={{
                color: colors.text,
            }}
        />
    );
}

export default withTheme(SidebarItem);
