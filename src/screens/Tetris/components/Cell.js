// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';

type Props = {
    item: Object
}

class Cell extends React.PureComponent<Props> {

    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    render() {
        const item = this.props.item;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: item.isEmpty ? 'transparent' : item.color,
                    borderColor: item.isEmpty ? 'transparent' : this.colors.tetrisBorder,
                    borderStyle: 'solid',
                    borderRadius: 2,
                    borderWidth: 1,
                    aspectRatio: 1,
                }}
                key={item.key}
            />
        );
    }


}

export default withTheme(Cell);
