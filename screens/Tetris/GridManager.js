// @flow

import Piece from "./Piece";
import ScoreManager from "./ScoreManager";

export default class GridManager {

    #currentGrid: Array<Array<Object>>;
    #colors: Object;

    constructor(width: number, height: number, colors: Object) {
        this.#colors = colors;
        this.#currentGrid = this.getEmptyGrid(height, width);
    }

    getCurrentGrid() {
        return this.#currentGrid;
    }

    getEmptyLine(width: number) {
        let line = [];
        for (let col = 0; col < width; col++) {
            line.push({
                color: this.#colors.tetrisBackground,
                isEmpty: true,
            });
        }
        return line;
    }

    getEmptyGrid(height: number, width: number) {
        let grid = [];
        for (let row = 0; row < height; row++) {
            grid.push(this.getEmptyLine(width));
        }
        return grid;
    }

    getGridCopy() {
        return JSON.parse(JSON.stringify(this.#currentGrid));
    }

    getFinalGrid(currentObject: Piece) {
        let finalGrid = this.getGridCopy();
        currentObject.toGrid(finalGrid, false);
        return finalGrid;
    }

    clearLines(lines: Array<number>, scoreManager: ScoreManager) {
        lines.sort();
        for (let i = 0; i < lines.length; i++) {
            this.#currentGrid.splice(lines[i], 1);
            this.#currentGrid.unshift(this.getEmptyLine(this.#currentGrid[0].length));
        }
        scoreManager.addLinesRemovedPoints(lines.length);
    }

    getLinesToClear(coord: Object) {
        let rows = [];
        for (let i = 0; i < coord.length; i++) {
            let isLineFull = true;
            for (let col = 0; col < this.#currentGrid[coord[i].y].length; col++) {
                if (this.#currentGrid[coord[i].y][col].isEmpty) {
                    isLineFull = false;
                    break;
                }
            }
            if (isLineFull && rows.indexOf(coord[i].y) === -1)
                rows.push(coord[i].y);
        }
        return rows;
    }

    freezeTetromino(currentObject: Piece, scoreManager: ScoreManager) {
        currentObject.toGrid(this.#currentGrid, false);
        this.clearLines(this.getLinesToClear(currentObject.getCoordinates()), scoreManager);
    }
}
