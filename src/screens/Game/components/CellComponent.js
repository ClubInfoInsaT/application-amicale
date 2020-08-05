// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';

export type CellType = {color: string, isEmpty: boolean, key: string};

type PropsType = {
  cell: CellType,
};

class CellComponent extends React.PureComponent<PropsType> {
  render(): React.Node {
    const {props} = this;
    const item = props.cell;
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
      />
    );
  }
}

export default withTheme(CellComponent);
