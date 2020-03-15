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
                    backgroundColor: this.props.color,
                    borderColor: this.props.isEmpty ? this.props.color : this.colors.tetrisBorder,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    aspectRatio: 1,
                }}
            />
        );
    }


}

export default withTheme(Cell);
