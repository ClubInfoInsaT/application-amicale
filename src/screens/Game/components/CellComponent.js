// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {CustomTheme} from "../../../managers/ThemeManager";

export type Cell = {color: string, isEmpty: boolean, key: string};

type Props = {
    cell: Cell,
    theme: CustomTheme,
}

class CellComponent extends React.PureComponent<Props> {

    render() {
        const item = this.props.cell;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: item.isEmpty ? 'transparent' : item.color,
                    borderColor: 'transparent',
                    borderRadius: 4,
                    borderWidth: 1,
                    aspectRatio: 1,
                }}
                key={item.key}
            />
        );
    }


}

export default withTheme(CellComponent);
