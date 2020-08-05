/* eslint-disable */

import React from 'react';
import GridManager from '../logic/GridManager';
import ScoreManager from '../logic/ScoreManager';
import Piece from '../logic/Piece';

let colors = {
  tetrisBackground: '#000002',
};

jest.mock('../ScoreManager');

afterAll(() => {
  jest.restoreAllMocks();
});

test('getEmptyLine', () => {
  let g = new GridManager(2, 2, colors);
  expect(g.getEmptyLine(2)).toStrictEqual([
    {color: colors.tetrisBackground, isEmpty: true},
    {color: colors.tetrisBackground, isEmpty: true},
  ]);

  expect(g.getEmptyLine(-1)).toStrictEqual([]);
});

test('getEmptyGrid', () => {
  let g = new GridManager(2, 2, colors);
  expect(g.getEmptyGrid(2, 2)).toStrictEqual([
    [
      {color: colors.tetrisBackground, isEmpty: true},
      {color: colors.tetrisBackground, isEmpty: true},
    ],
    [
      {color: colors.tetrisBackground, isEmpty: true},
      {color: colors.tetrisBackground, isEmpty: true},
    ],
  ]);

  expect(g.getEmptyGrid(-1, 2)).toStrictEqual([]);
  expect(g.getEmptyGrid(2, -1)).toStrictEqual([[], []]);
});

test('getLinesToClear', () => {
  let g = new GridManager(2, 2, colors);
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
  let g = new GridManager(2, 2, colors);
  let grid = [
    [
      {color: colors.tetrisBackground, isEmpty: true},
      {color: colors.tetrisBackground, isEmpty: true},
    ],
    [
      {color: '0', isEmpty: true},
      {color: '0', isEmpty: true},
    ],
  ];
  g.getCurrentGrid()[1][0].color = '0';
  g.getCurrentGrid()[1][1].color = '0';
  expect(g.getCurrentGrid()).toStrictEqual(grid);
  let scoreManager = new ScoreManager();
  g.clearLines([1], scoreManager);
  grid = [
    [
      {color: colors.tetrisBackground, isEmpty: true},
      {color: colors.tetrisBackground, isEmpty: true},
    ],
    [
      {color: colors.tetrisBackground, isEmpty: true},
      {color: colors.tetrisBackground, isEmpty: true},
    ],
  ];
  expect(g.getCurrentGrid()).toStrictEqual(grid);
});

test('freezeTetromino', () => {
  let g = new GridManager(2, 2, colors);
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
