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
