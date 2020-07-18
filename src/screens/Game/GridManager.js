// @flow

import Piece from "./Piece";
import ScoreManager from "./ScoreManager";
import type {Coordinates} from './Shapes/BaseShape';
import type {Grid} from "./components/GridComponent";
import type {Cell} from "./components/CellComponent";
import type {CustomTheme} from "../../managers/ThemeManager";

/**
 * Class used to manage the game grid
 */
export default class GridManager {

    #currentGrid: Grid;
    #theme: CustomTheme;

    /**
     * Initializes a grid of the given size
     *
     * @param width The grid width
     * @param height The grid height
     * @param theme Object containing current theme
     */
    constructor(width: number, height: number, theme: CustomTheme) {
        this.#theme = theme;
        this.#currentGrid = this.getEmptyGrid(height, width);
    }

    /**
     * Get the current grid
     *
     * @return {Grid} The current grid
     */
    getCurrentGrid(): Grid {
        return this.#currentGrid;
    }

    /**
     * Get a new empty grid line of the given size
     *
     * @param width The line size
     * @return {Array<Cell>}
     */
    getEmptyLine(width: number): Array<Cell> {
        let line = [];
        for (let col = 0; col < width; col++) {
            line.push({
                color: this.#theme.colors.tetrisBackground,
                isEmpty: true,
                key: col.toString(),
            });
        }
        return line;
    }

    /**
     * Gets a new empty grid
     *
     * @param width The grid width
     * @param height The grid height
     * @return {Grid} A new empty grid
     */
    getEmptyGrid(height: number, width: number): Grid {
        let grid = [];
        for (let row = 0; row < height; row++) {
            grid.push(this.getEmptyLine(width));
        }
        return grid;
    }

    /**
     * Removes the given lines from the grid,
     * shifts down every line on top and adds new empty lines on top.
     *
     * @param lines An array of line numbers to remove
     * @param scoreManager A reference to the score manager
     */
    clearLines(lines: Array<number>, scoreManager: ScoreManager) {
        lines.sort();
        for (let i = 0; i < lines.length; i++) {
            this.#currentGrid.splice(lines[i], 1);
            this.#currentGrid.unshift(this.getEmptyLine(this.#currentGrid[0].length));
        }
        scoreManager.addLinesRemovedPoints(lines.length);
    }

    /**
     * Gets the lines to clear around the given piece's coordinates.
     * The piece's coordinates are used for optimization and to prevent checking the whole grid.
     *
     * @param pos The piece's coordinates to check lines at
     * @return {Array<number>} An array containing the line numbers to clear
     */
    getLinesToClear(pos: Array<Coordinates>): Array<number> {
        let rows = [];
        for (let i = 0; i < pos.length; i++) {
            let isLineFull = true;
            for (let col = 0; col < this.#currentGrid[pos[i].y].length; col++) {
                if (this.#currentGrid[pos[i].y][col].isEmpty) {
                    isLineFull = false;
                    break;
                }
            }
            if (isLineFull && rows.indexOf(pos[i].y) === -1)
                rows.push(pos[i].y);
        }
        return rows;
    }

    /**
     * Freezes the given piece to the grid
     *
     * @param currentObject The piece to freeze
     * @param scoreManager A reference to the score manager
     */
    freezeTetromino(currentObject: Piece, scoreManager: ScoreManager) {
        this.clearLines(this.getLinesToClear(currentObject.getCoordinates()), scoreManager);
    }
}
