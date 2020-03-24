import React from 'react';
import GridManager from "../GridManager";

let colors = {
    tetrisBackground: "#000002"
};

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

