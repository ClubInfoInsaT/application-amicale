// @flow

import * as React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, withTheme} from 'react-native-paper';

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function BasicLoadingScreen(props) {
    const {colors} = props.theme;
    let position = undefined;
    if (props.isAbsolute !== undefined && props.isAbsolute)
        position = 'absolute';

    return (
        <View style={{
            backgroundColor: colors.background,
            position: position,
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
        }}>
            <ActivityIndicator
                animating={true}
                size={'large'}
                color={colors.primary}/>
        </View>
    );
}

export default withTheme(BasicLoadingScreen);
