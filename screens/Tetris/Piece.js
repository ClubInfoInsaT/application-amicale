import ShapeL from "./Shapes/ShapeL";
import ShapeI from "./Shapes/ShapeI";
import ShapeJ from "./Shapes/ShapeJ";
import ShapeO from "./Shapes/ShapeO";
import ShapeS from "./Shapes/ShapeS";
import ShapeT from "./Shapes/ShapeT";
import ShapeZ from "./Shapes/ShapeZ";
import type {coordinates} from './Shapes/BaseShape';
import type {grid} from './GridManager';

/**
 * Class used as an abstraction layer for shapes.
 * Use this class to manipulate pieces rather than Shapes directly
 *
 */
export default class Piece {

    #shapes = [
        ShapeL,
        ShapeI,
        ShapeJ,
        ShapeO,
        ShapeS,
        ShapeT,
        ShapeZ,
    ];
    #currentShape: Object;
    #colors: Object;

    /**
     * Initializes this piece's color and shape
     *
     * @param colors Object containing current theme colors
     */
    constructor(colors: Object) {
        this.#currentShape = this.getRandomShape(colors);
        this.#colors = colors;
    }

    /**
     * Gets a random shape object
     *
     * @param colors Object containing current theme colors
     */
    getRandomShape(colors: Object) {
        return new this.#shapes[Math.floor(Math.random() * 7)](colors);
    }

    /**
     * Removes the piece from the given grid
     *
     * @param grid The grid to remove the piece from
     */
    removeFromGrid(grid: grid) {
        const coord: Array<coordinates> = this.#currentShape.getCellsCoordinates(true);
        for (let i = 0; i < coord.length; i++) {
            grid[coord[i].y][coord[i].x] = {
                color: this.#colors.tetrisBackground,
                isEmpty: true,
            };
        }
    }

    /**
     * Adds this piece to the given grid
     *
     * @param grid The grid to add the piece to
     * @param isPreview Should we use this piece's current position to determine the cells?
     */
    toGrid(grid: grid, isPreview: boolean) {
        const coord: Array<coordinates> = this.#currentShape.getCellsCoordinates(!isPreview);
        for (let i = 0; i < coord.length; i++) {
            grid[coord[i].y][coord[i].x] = {
                color: this.#currentShape.getColor(),
                isEmpty: false,
            };
        }
    }

    /**
     * Checks if the piece's current position is valid
     *
     * @param grid The current game grid
     * @param width The grid's width
     * @param height The grid's height
     * @return {boolean} If the position is valid
     */
    isPositionValid(grid: grid, width: number, height: number) {
        let isValid = true;
        const coord: Array<coordinates> = this.#currentShape.getCellsCoordinates(true);
        for (let i = 0; i < coord.length; i++) {
            if (coord[i].x >= width
                || coord[i].x < 0
                || coord[i].y >= height
                || coord[i].y < 0
                || !grid[coord[i].y][coord[i].x].isEmpty) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    /**
     * Tries to move the piece by the given offset on the given grid
     *
     * @param x Position X offset
     * @param y Position Y offset
     * @param grid The grid to move the piece on
     * @param width The grid's width
     * @param height The grid's height
     * @param freezeCallback Callback to use if the piece should freeze itself
     * @return {boolean} True if the move was valid, false otherwise
     */
    tryMove(x: number, y: number, grid: grid, width: number, height: number, freezeCallback: Function) {
        if (x > 1) x = 1; // Prevent moving from more than one tile
        if (x < -1) x = -1;
        if (y > 1) y = 1;
        if (y < -1) y = -1;
        if (x !== 0 && y !== 0) y = 0; // Prevent diagonal movement

        this.removeFromGrid(grid);
        this.#currentShape.move(x, y);
        let isValid = this.isPositionValid(grid, width, height);

        if (!isValid)
            this.#currentShape.move(-x, -y);

        let shouldFreeze = !isValid && y !== 0;
        this.toGrid(grid, false);
        if (shouldFreeze)
            freezeCallback();
        return isValid;
    }

    /**
     * Tries to rotate the piece
     *
     * @param grid The grid to rotate the piece on
     * @param width The grid's width
     * @param height The grid's height
     * @return {boolean} True if the rotation was valid, false otherwise
     */
    tryRotate(grid: grid, width: number, height: number) {
        this.removeFromGrid(grid);
        this.#currentShape.rotate(true);
        if (!this.isPositionValid(grid, width, height)) {
            this.#currentShape.rotate(false);
            this.toGrid(grid, false);
            return false;
        }
        this.toGrid(grid, false);
        return true;
    }

    /**
     * Gets this piece used cells coordinates
     *
     * @return {Array<coordinates>} An array of coordinates
     */
    getCoordinates(): Array<coordinates> {
        return this.#currentShape.getCellsCoordinates(true);
    }
}
