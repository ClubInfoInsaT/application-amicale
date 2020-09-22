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
import {View, ViewStyle} from 'react-native';
import type {CellType} from './CellComponent';
import CellComponent from './CellComponent';

export type GridType = Array<Array<CellType>>;

type PropsType = {
  grid: GridType;
  height: number;
  width: number;
  style: ViewStyle;
};

const getCellRender = (item: CellType) => {
  return <CellComponent cell={item} key={item.key} />;
};

function getRow(grid: GridType, rowNumber: number) {
  return (
    <View style={{flexDirection: 'row'}} key={rowNumber.toString()}>
      {grid[rowNumber].map(getCellRender)}
    </View>
  );
}

function getGrid(grid: GridType, height: number) {
  const rows = [];
  for (let i = 0; i < height; i += 1) {
    rows.push(getRow(grid, i));
  }
  return rows;
}

function GridComponent(props: PropsType) {
  const {style, width, height, grid} = props;
  return (
    <View
      style={{
        aspectRatio: width / height,
        borderRadius: 4,
        ...style,
      }}>
      {getGrid(grid, height)}
    </View>
  );
}

export default GridComponent;
