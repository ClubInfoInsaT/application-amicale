import * as React from 'react';
import {IconButton, withTheme} from 'react-native-paper';

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function HeaderButton(props) {
    const {colors} = props.theme;
    return (
        <IconButton
            icon={props.icon}
            size={26}
            color={props.color !== undefined ? props.color : colors.text}
            onPress={props.onPress}
        />
    );
}

export default withTheme(HeaderButton);
