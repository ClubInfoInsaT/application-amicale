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

import Piece from '../logic/Piece';
import ShapeI from '../Shapes/ShapeI';

let theme = {
  colors: {
    tetrisI: '#000001',
    tetrisBackground: '#000002',
  },
};

jest.mock('../Shapes/ShapeI');

beforeAll(() => {
  jest.spyOn(Piece.prototype, 'getRandomShape').mockImplementation((colors) => {
    return new ShapeI(colors);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('isPositionValid', () => {
  let x = 0;
  let y = 0;
  let spy = jest
    .spyOn(ShapeI.prototype, 'getCellsCoordinates')
    .mockImplementation(() => {
      return [{ x: x, y: y }];
    });
  let grid = [
    [{ isEmpty: true }, { isEmpty: true }],
    [{ isEmpty: true }, { isEmpty: false }],
  ];
  let size = 2;

  let p = new Piece(theme);
  expect(p.isPositionValid(grid, size, size)).toBeTrue();
  x = 1;
  y = 0;
  expect(p.isPositionValid(grid, size, size)).toBeTrue();
  x = 0;
  y = 1;
  expect(p.isPositionValid(grid, size, size)).toBeTrue();
  x = 1;
  y = 1;
  expect(p.isPositionValid(grid, size, size)).toBeFalse();
  x = 2;
  y = 0;
  expect(p.isPositionValid(grid, size, size)).toBeFalse();
  x = -1;
  y = 0;
  expect(p.isPositionValid(grid, size, size)).toBeFalse();
  x = 0;
  y = 2;
  expect(p.isPositionValid(grid, size, size)).toBeFalse();
  x = 0;
  y = -1;
  expect(p.isPositionValid(grid, size, size)).toBeFalse();

  spy.mockRestore();
});

test('tryMove', () => {
  let p = new Piece(theme);
  const callbackMock = jest.fn();
  let isValid = true;
  let spy1 = jest
    .spyOn(Piece.prototype, 'isPositionValid')
    .mockImplementation(() => {
      return isValid;
    });
  let spy2 = jest
    .spyOn(Piece.prototype, 'removeFromGrid')
    .mockImplementation(() => {});
  let spy3 = jest.spyOn(Piece.prototype, 'toGrid').mockImplementation(() => {});

  expect(p.tryMove(-1, 0, null, null, null, callbackMock)).toBeTrue();
  isValid = false;
  expect(p.tryMove(-1, 0, null, null, null, callbackMock)).toBeFalse();
  isValid = true;
  expect(p.tryMove(0, 1, null, null, null, callbackMock)).toBeTrue();
  expect(callbackMock).toBeCalledTimes(0);

  isValid = false;
  expect(p.tryMove(0, 1, null, null, null, callbackMock)).toBeFalse();
  expect(callbackMock).toBeCalledTimes(1);

  expect(spy2).toBeCalledTimes(4);
  expect(spy3).toBeCalledTimes(4);

  spy1.mockRestore();
  spy2.mockRestore();
  spy3.mockRestore();
});

test('tryRotate', () => {
  let p = new Piece(theme);
  let isValid = true;
  let spy1 = jest
    .spyOn(Piece.prototype, 'isPositionValid')
    .mockImplementation(() => {
      return isValid;
    });
  let spy2 = jest
    .spyOn(Piece.prototype, 'removeFromGrid')
    .mockImplementation(() => {});
  let spy3 = jest.spyOn(Piece.prototype, 'toGrid').mockImplementation(() => {});

  expect(p.tryRotate(null, null, null)).toBeTrue();
  isValid = false;
  expect(p.tryRotate(null, null, null)).toBeFalse();

  expect(spy2).toBeCalledTimes(2);
  expect(spy3).toBeCalledTimes(2);

  spy1.mockRestore();
  spy2.mockRestore();
  spy3.mockRestore();
});

test('toGrid', () => {
  let x = 0;
  let y = 0;
  let spy1 = jest
    .spyOn(ShapeI.prototype, 'getCellsCoordinates')
    .mockImplementation(() => {
      return [{ x: x, y: y }];
    });
  let spy2 = jest.spyOn(ShapeI.prototype, 'getColor').mockImplementation(() => {
    return theme.colors.tetrisI;
  });
  let grid = [
    [
      { isEmpty: true, key: '0' },
      { isEmpty: true, key: '1' },
    ],
    [
      { isEmpty: true, key: '0' },
      { isEmpty: true, key: '1' },
    ],
  ];
  let expectedGrid = [
    [
      { color: theme.colors.tetrisI, isEmpty: false, key: '0' },
      { isEmpty: true, key: '1' },
    ],
    [
      { isEmpty: true, key: '0' },
      { isEmpty: true, key: '1' },
    ],
  ];

  let p = new Piece(theme);
  p.toGrid(grid, true);
  expect(grid).toStrictEqual(expectedGrid);

  spy1.mockRestore();
  spy2.mockRestore();
});

test('removeFromGrid', () => {
  let gridOld = [
    [
      { color: theme.colors.tetrisI, isEmpty: false, key: '0' },
      { color: theme.colors.tetrisI, isEmpty: false, key: '1' },
      { color: theme.colors.tetrisBackground, isEmpty: true, key: '2' },
    ],
  ];
  let gridNew = [
    [
      { color: theme.colors.tetrisBackground, isEmpty: true, key: '0' },
      { color: theme.colors.tetrisBackground, isEmpty: true, key: '1' },
      { color: theme.colors.tetrisBackground, isEmpty: true, key: '2' },
    ],
  ];
  let oldCoord = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  let spy1 = jest
    .spyOn(ShapeI.prototype, 'getCellsCoordinates')
    .mockImplementation(() => {
      return oldCoord;
    });
  let spy2 = jest.spyOn(ShapeI.prototype, 'getColor').mockImplementation(() => {
    return theme.colors.tetrisI;
  });
  let p = new Piece(theme);
  p.removeFromGrid(gridOld);
  expect(gridOld).toStrictEqual(gridNew);

  spy1.mockRestore();
  spy2.mockRestore();
});
