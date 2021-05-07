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

import * as React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import type { GridType } from './GridComponent';
import GridComponent from './GridComponent';

type PropsType = {
  items: Array<GridType>;
  style: ViewStyle;
};

const styles = StyleSheet.create({
  grid: {
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
  },
});

function getGridRender(item: GridType, index: number) {
  return (
    <GridComponent
      width={item[0].length}
      height={item.length}
      grid={item}
      style={styles.grid}
      key={index.toString()}
    />
  );
}

function getGrids(items: Array<GridType>) {
  const grids: Array<React.ReactNode> = [];
  items.forEach((item: GridType, index: number) => {
    grids.push(getGridRender(item, index));
  });
  return grids;
}

class Preview extends React.PureComponent<PropsType> {
  render() {
    const { style, items } = this.props;
    if (items.length > 0) {
      return <View style={style}>{getGrids(items)}</View>;
    }
    return null;
  }
}

export default Preview;
