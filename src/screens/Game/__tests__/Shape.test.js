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

import BaseShape from '../Shapes/BaseShape';
import ShapeI from '../Shapes/ShapeI';

const theme = {
  colors: {
    tetrisI: '#000001',
    tetrisO: '#000002',
    tetrisT: '#000003',
    tetrisS: '#000004',
    tetrisZ: '#000005',
    tetrisJ: '#000006',
    tetrisL: '#000007',
  },
};

test('constructor', () => {
  expect(() => new BaseShape()).toThrow(Error);

  let T = new ShapeI(theme);
  expect(T.position.y).toBe(0);
  expect(T.position.x).toBe(3);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[0]);
  expect(T.getColor()).toBe(theme.colors.tetrisI);
});

test('move', () => {
  let T = new ShapeI(theme);
  T.move(0, 1);
  expect(T.position.x).toBe(3);
  expect(T.position.y).toBe(1);
  T.move(1, 0);
  expect(T.position.x).toBe(4);
  expect(T.position.y).toBe(1);
  T.move(1, 1);
  expect(T.position.x).toBe(5);
  expect(T.position.y).toBe(2);
  T.move(2, 2);
  expect(T.position.x).toBe(7);
  expect(T.position.y).toBe(4);
  T.move(-1, -1);
  expect(T.position.x).toBe(6);
  expect(T.position.y).toBe(3);
});

test('rotate', () => {
  let T = new ShapeI(theme);
  T.rotate(true);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[1]);
  T.rotate(true);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[2]);
  T.rotate(true);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[3]);
  T.rotate(true);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[0]);
  T.rotate(false);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[3]);
  T.rotate(false);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[2]);
  T.rotate(false);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[1]);
  T.rotate(false);
  expect(T.getCurrentShape()).toStrictEqual(T.getShapes()[0]);
});

test('getCellsCoordinates', () => {
  let T = new ShapeI(theme);
  expect(T.getCellsCoordinates(false)).toStrictEqual([
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ]);
  expect(T.getCellsCoordinates(true)).toStrictEqual([
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
  ]);
  T.move(1, 1);
  expect(T.getCellsCoordinates(false)).toStrictEqual([
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ]);
  expect(T.getCellsCoordinates(true)).toStrictEqual([
    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
  ]);
  T.rotate(true);
  expect(T.getCellsCoordinates(false)).toStrictEqual([
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    { x: 2, y: 3 },
  ]);
  expect(T.getCellsCoordinates(true)).toStrictEqual([
    { x: 6, y: 1 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
  ]);
});
