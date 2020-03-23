import React from 'react';
import Piece from "../Piece";
import ShapeI from "../Shapes/ShapeI";

let colors = {
    tetrisI: "#000001",
    tetrisBackground: "#000002"
};

jest.mock("../Shapes/ShapeI");

beforeAll(() => {
    jest.spyOn(Piece.prototype, 'getRandomShape')
        .mockImplementation((colors: Object) => {return new ShapeI(colors);});
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('isPositionValid', () => {
    let x = 0;
    let y = 0;
    let spy = jest.spyOn(ShapeI.prototype, 'getCellsCoordinates')
        .mockImplementation(() => {return [{x: x, y: y}];});
    let grid = [
        [{isEmpty: true}, {isEmpty: true}],
        [{isEmpty: true}, {isEmpty: false}],
    ];
    let size = 2;

    let p = new Piece(colors);
    expect(p.isPositionValid(grid, size, size)).toBeTrue();
    x = 1; y = 0;
    expect(p.isPositionValid(grid, size, size)).toBeTrue();
    x = 0; y = 1;
    expect(p.isPositionValid(grid, size, size)).toBeTrue();
    x = 1; y = 1;
    expect(p.isPositionValid(grid, size, size)).toBeFalse();
    x = 2; y = 0;
    expect(p.isPositionValid(grid, size, size)).toBeFalse();
    x = -1; y = 0;
    expect(p.isPositionValid(grid, size, size)).toBeFalse();
    x = 0; y = 2;
    expect(p.isPositionValid(grid, size, size)).toBeFalse();
    x = 0; y = -1;
    expect(p.isPositionValid(grid, size, size)).toBeFalse();

    spy.mockRestore();
});

test('tryMove', () => {
    let p = new Piece(colors);
    const callbackMock = jest.fn();
    let isValid = true;
    let spy = jest.spyOn(Piece.prototype, 'isPositionValid')
        .mockImplementation(() => {return isValid;});

    expect(p.tryMove(-1, 0, null, null, null, callbackMock)).toBeTrue();
    isValid = false;
    expect(p.tryMove(-1, 0, null, null, null, callbackMock)).toBeFalse();
    isValid = true;
    expect(p.tryMove(0, 1, null, null, null, callbackMock)).toBeTrue();
    expect(callbackMock).toBeCalledTimes(0);

    isValid = false;
    expect(p.tryMove(0, 1, null, null, null, callbackMock)).toBeFalse();
    expect(callbackMock).toBeCalledTimes(1);

    spy.mockRestore();
});

test('tryRotate', () => {
    let p = new Piece(colors);
    let isValid = true;
    let spy = jest.spyOn(Piece.prototype, 'isPositionValid')
        .mockImplementation(() => {return isValid;});

    expect(p.tryRotate( null, null, null)).toBeTrue();
    isValid = false;
    expect(p.tryRotate( null, null, null)).toBeFalse();

    spy.mockRestore();
});


test('toGrid', () => {
    let x = 0;
    let y = 0;
    let spy1 = jest.spyOn(ShapeI.prototype, 'getCellsCoordinates')
        .mockImplementation(() => {return [{x: x, y: y}];});
    let spy2 = jest.spyOn(ShapeI.prototype, 'getColor')
        .mockImplementation(() => {return colors.tetrisI;});
    let grid = [
        [{isEmpty: true}, {isEmpty: true}],
        [{isEmpty: true}, {isEmpty: true}],
    ];
    let expectedGrid = [
        [{color: colors.tetrisI, isEmpty: false}, {isEmpty: true}],
        [{isEmpty: true}, {isEmpty: true}],
    ];

    let p = new Piece(colors);
    p.toGrid(grid, true);
    expect(grid).toStrictEqual(expectedGrid);

    spy1.mockRestore();
    spy2.mockRestore();
});
