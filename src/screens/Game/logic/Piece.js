import ShapeL from "../Shapes/ShapeL";
import ShapeI from "../Shapes/ShapeI";
import ShapeJ from "../Shapes/ShapeJ";
import ShapeO from "../Shapes/ShapeO";
import ShapeS from "../Shapes/ShapeS";
import ShapeT from "../Shapes/ShapeT";
import ShapeZ from "../Shapes/ShapeZ";
import type {Coordinates} from '../Shapes/BaseShape';
import BaseShape from "../Shapes/BaseShape";
import type {Grid} from "../components/GridComponent";
import type {CustomTheme} from "../../../managers/ThemeManager";

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
    #currentShape: BaseShape;
    #theme: CustomTheme;

    /**
     * Initializes this piece's color and shape
     *
     * @param theme Object containing current theme
     */
    constructor(theme: CustomTheme) {
        this.#currentShape = this.getRandomShape(theme);
        this.#theme = theme;
    }

    /**
     * Gets a random shape object
     *
     * @param theme Object containing current theme
     */
    getRandomShape(theme: CustomTheme) {
        return new this.#shapes[Math.floor(Math.random() * 7)](theme);
    }

    /**
     * Removes the piece from the given grid
     *
     * @param grid The grid to remove the piece from
     */
    removeFromGrid(grid: Grid) {
        const pos: Array<Coordinates> = this.#currentShape.getCellsCoordinates(true);
        for (let i = 0; i < pos.length; i++) {
            grid[pos[i].y][pos[i].x] = {
                color: this.#theme.colors.tetrisBackground,
                isEmpty: true,
                key: grid[pos[i].y][pos[i].x].key
            };
        }
    }

    /**
     * Adds this piece to the given grid
     *
     * @param grid The grid to add the piece to
     * @param isPreview Should we use this piece's current position to determine the cells?
     */
    toGrid(grid: Grid, isPreview: boolean) {
        const pos: Array<Coordinates> = this.#currentShape.getCellsCoordinates(!isPreview);
        for (let i = 0; i < pos.length; i++) {
            grid[pos[i].y][pos[i].x] = {
                color: this.#currentShape.getColor(),
                isEmpty: false,
                key: grid[pos[i].y][pos[i].x].key
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
    isPositionValid(grid: Grid, width: number, height: number) {
        let isValid = true;
        const pos: Array<Coordinates> = this.#currentShape.getCellsCoordinates(true);
        for (let i = 0; i < pos.length; i++) {
            if (pos[i].x >= width
                || pos[i].x < 0
                || pos[i].y >= height
                || pos[i].y < 0
                || !grid[pos[i].y][pos[i].x].isEmpty) {
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
    tryMove(x: number, y: number, grid: Grid, width: number, height: number, freezeCallback: () => void) {
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
    tryRotate(grid: Grid, width: number, height: number) {
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
     * @return {Array<Coordinates>} An array of coordinates
     */
    getCoordinates(): Array<Coordinates> {
        return this.#currentShape.getCellsCoordinates(true);
    }
}
