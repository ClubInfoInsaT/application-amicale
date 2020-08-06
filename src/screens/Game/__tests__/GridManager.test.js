/* eslint-disable */

import React from 'react';
import GridManager from '../logic/GridManager';
import ScoreManager from '../logic/ScoreManager';
import Piece from '../logic/Piece';

let theme = {
  colors: {
    tetrisBackground: '#000002',
  },
};

jest.mock('../logic/ScoreManager');

afterAll(() => {
  jest.restoreAllMocks();
});

test('getEmptyLine', () => {
  let g = new GridManager(2, 2, theme);
  expect(g.getEmptyLine(2)).toStrictEqual([
    {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
    {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
  ]);

  expect(g.getEmptyLine(-1)).toStrictEqual([]);
});

test('getEmptyGrid', () => {
  let g = new GridManager(2, 2, theme);
  expect(g.getEmptyGrid(2, 2)).toStrictEqual([
    [
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
    ],
    [
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
    ],
  ]);

  expect(g.getEmptyGrid(-1, 2)).toStrictEqual([]);
  expect(g.getEmptyGrid(2, -1)).toStrictEqual([[], []]);
});

test('getLinesToClear', () => {
  let g = new GridManager(2, 2, theme);
  g.getCurrentGrid()[0][0].isEmpty = false;
  g.getCurrentGrid()[0][1].isEmpty = false;
  let coord = [{x: 1, y: 0}];
  expect(g.getLinesToClear(coord)).toStrictEqual([0]);

  g.getCurrentGrid()[0][0].isEmpty = true;
  g.getCurrentGrid()[0][1].isEmpty = true;
  g.getCurrentGrid()[1][0].isEmpty = false;
  g.getCurrentGrid()[1][1].isEmpty = false;
  expect(g.getLinesToClear(coord)).toStrictEqual([]);
  coord = [{x: 1, y: 1}];
  expect(g.getLinesToClear(coord)).toStrictEqual([1]);
});

test('clearLines', () => {
  let g = new GridManager(2, 2, theme);
  let grid = [
    [
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
    ],
    [
      {color: '0', isEmpty: true, key: '0'},
      {color: '0', isEmpty: true, key: '1'},
    ],
  ];
  g.getCurrentGrid()[1][0].color = '0';
  g.getCurrentGrid()[1][1].color = '0';
  expect(g.getCurrentGrid()).toStrictEqual(grid);
  let scoreManager = new ScoreManager();
  g.clearLines([1], scoreManager);
  grid = [
    [
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
    ],
    [
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '0'},
      {color: theme.colors.tetrisBackground, isEmpty: true, key: '1'},
    ],
  ];
  expect(g.getCurrentGrid()).toStrictEqual(grid);
});

test('freezeTetromino', () => {
  let g = new GridManager(2, 2, theme);
  let spy1 = jest
    .spyOn(GridManager.prototype, 'getLinesToClear')
    .mockImplementation(() => {});
  let spy2 = jest
    .spyOn(GridManager.prototype, 'clearLines')
    .mockImplementation(() => {});
  g.freezeTetromino(new Piece({}), null);

  expect(spy1).toHaveBeenCalled();
  expect(spy2).toHaveBeenCalled();

  spy1.mockRestore();
  spy2.mockRestore();
});
