// @flow

import * as React from 'react';
import {View} from 'react-native';
import {withTheme} from 'react-native-paper';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {CellType} from './CellComponent';
import CellComponent from './CellComponent';

export type GridType = Array<Array<CellComponent>>;

type PropsType = {
  grid: Array<Array<CellType>>,
  height: number,
  width: number,
  style: ViewStyle,
};

class GridComponent extends React.Component<PropsType> {
  getRow(rowNumber: number): React.Node {
    const {grid} = this.props;
    return (
      <View style={{flexDirection: 'row'}} key={rowNumber.toString()}>
        {grid[rowNumber].map(this.getCellRender)}
      </View>
    );
  }

  getCellRender = (item: CellType): React.Node => {
    return <CellComponent cell={item} key={item.key} />;
  };

  getGrid(): React.Node {
    const {height} = this.props;
    const rows = [];
    for (let i = 0; i < height; i += 1) {
      rows.push(this.getRow(i));
    }
    return rows;
  }

  render(): React.Node {
    const {style, width, height} = this.props;
    return (
      <View
        style={{
          aspectRatio: width / height,
          borderRadius: 4,
          ...style,
        }}>
        {this.getGrid()}
      </View>
    );
  }
}

export default withTheme(GridComponent);
