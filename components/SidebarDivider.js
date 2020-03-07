import * as React from 'react';
import { withTheme } from 'react-native-paper';
import {DrawerItem} from "@react-navigation/drawer";

function SidebarDivider(props) {
    const { colors } = props.theme;
    return (
        <DrawerItem
            label={props.title}
            focused={false}
            onPress={undefined}
            style={{
                marginLeft: 0,
                marginRight: 0,
                padding: 0,
                borderRadius: 0,
                backgroundColor: colors.dividerBackground
            }}
        />
    );
}

export default withTheme(SidebarDivider);
