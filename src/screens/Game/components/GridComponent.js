/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

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
