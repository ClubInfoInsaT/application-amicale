// @flow

import * as React from 'react';
import {ActivityIndicator, withTheme} from 'react-native-paper';
import {View} from "react-native";

/**
 * Component used to display a header button
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function BasicLoadingScreen(props) {
    const {colors} = props.theme;
    return (
        <View style={{
            backgroundColor: colors.background,
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator
                animating={true}
                size={'large'}
                color={colors.primary}/>
        </View>
    );
}

export default withTheme(BasicLoadingScreen);
