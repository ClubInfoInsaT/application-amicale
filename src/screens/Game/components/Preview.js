// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {GridType} from './GridComponent';
import GridComponent from './GridComponent';

type PropsType = {
  items: Array<GridType>,
  style: ViewStyle,
};

class Preview extends React.PureComponent<PropsType> {
  getGrids(): React.Node {
    const {items} = this.props;
    const grids = [];
    items.forEach((item: GridType, index: number) => {
      grids.push(Preview.getGridRender(item, index));
    });
    return grids;
  }

  static getGridRender(item: GridType, index: number): React.Node {
    return (
      <GridComponent
        width={item[0].length}
        height={item.length}
        grid={item}
        style={{
          marginRight: 5,
          marginLeft: 5,
          marginBottom: 5,
        }}
        key={index.toString()}
      />
    );
  }

  render(): React.Node {
    const {style, items} = this.props;
    if (items.length > 0) {
      return <View style={style}>{this.getGrids()}</View>;
    }
    return null;
  }
}

export default withTheme(Preview);
