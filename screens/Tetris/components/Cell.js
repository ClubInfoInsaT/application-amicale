// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';

function Cell(props) {
    const colors = props.theme.colors;
    return (
        <View style={{
            flex: 1,
            backgroundColor: props.color,
            borderColor: props.isEmpty ? props.color : "#393939",
            borderStyle: 'solid',
            borderWidth: 1,
            aspectRatio: 1,
        }}/>
    );
}

export default withTheme(Cell);
