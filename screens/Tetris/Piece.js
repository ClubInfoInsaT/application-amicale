import ShapeL from "./Shapes/ShapeL";
import ShapeI from "./Shapes/ShapeI";
import ShapeJ from "./Shapes/ShapeJ";
import ShapeO from "./Shapes/ShapeO";
import ShapeS from "./Shapes/ShapeS";
import ShapeT from "./Shapes/ShapeT";
import ShapeZ from "./Shapes/ShapeZ";

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

    constructor(colors: Object) {
        this.#currentShape = this.getRandomShape(colors);
        this.#colors = colors;
    }

    getRandomShape(colors: Object) {
        return new this.#shapes[Math.floor(Math.random() * 7)](colors);
    }

    removeFromGrid(grid) {
        const coord = this.#currentShape.getCellsCoordinates(true);
        for (let i = 0; i < coord.length; i++) {
            grid[coord[i].y][coord[i].x] = {
                color: this.#colors.tetrisBackground,
                isEmpty: true,
            };
        }
    }

    toGrid(grid: Array<Array<Object>>, isPreview: boolean) {
        const coord = this.#currentShape.getCellsCoordinates(!isPreview);
        for (let i = 0; i < coord.length; i++) {
            grid[coord[i].y][coord[i].x] = {
                color: this.#currentShape.getColor(),
                isEmpty: false,
            };
        }
    }

    isPositionValid(grid, width, height) {
        let isValid = true;
        const coord = this.#currentShape.getCellsCoordinates(true);
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

    tryMove(x: number, y: number, grid, width, height, freezeCallback: Function) {
        if (x > 1) x = 1; // Prevent moving from more than one tile
        if (x < -1) x = -1;
        if (y > 1) y = 1;
        if (y < -1) y = -1;
        if (x !== 0 && y !== 0) y = 0; // Prevent diagonal movement

        this.removeFromGrid(grid);
        this.#currentShape.move(x, y);
        let isValid = this.isPositionValid(grid, width, height);
        let shouldFreeze = false;

        if (!isValid)
            this.#currentShape.move(-x, -y);

        shouldFreeze = !isValid && y !== 0;
        this.toGrid(grid, false);
        if (shouldFreeze)
            freezeCallback();
        return isValid;
    }

    tryRotate(grid, width, height) {
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

    getCoordinates() {
        return this.#currentShape.getCellsCoordinates(true);
    }
}
