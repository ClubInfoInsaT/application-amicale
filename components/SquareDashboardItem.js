import * as React from 'react';
import {Badge, IconButton, withTheme} from 'react-native-paper';
import {View} from "react-native";

function SquareDashboardItem(props) {
    const {colors} = props.theme;
    return (
        <View>
            <IconButton
                icon={props.icon}
                color={
                    props.isAvailable ?
                        props.color :
                        colors.textDisabled
                }
                size={35}
                onPress={props.clickAction}
            />
            {
                props.badgeNumber > 0 ?
                    <Badge
                        style={{
                            position: 'absolute',
                            top: 5,
                            right: 5
                        }}>{props.badgeNumber}</Badge> : null
            }

        </View>
    );
}

export default withTheme(SquareDashboardItem);
