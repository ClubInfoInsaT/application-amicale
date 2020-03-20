// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';

type Props = {
    color: string,
    isEmpty: boolean,
    id: string,
}

class Cell extends React.PureComponent<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: this.props.isEmpty ? 'transparent' : this.props.color,
                    borderColor: this.props.isEmpty ? 'transparent' : this.colors.tetrisBorder,
                    borderStyle: 'solid',
                    borderRadius: 2,
                    borderWidth: 1,
                    aspectRatio: 1,
                }}
            />
        );
    }


}

export default withTheme(Cell);
