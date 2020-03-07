import * as React from 'react';
import {IconButton, withTheme} from 'react-native-paper';

function HeaderButton(props) {
    const { colors } = props.theme;
    return (
        <IconButton
            icon={props.icon}
            size={26}
            color={colors.text}
            onPress={props.onPress}
        />
    );
}

export default withTheme(HeaderButton);
