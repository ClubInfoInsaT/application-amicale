// @flow

/**
 * Abstract class used to represent a BaseShape.
 * Abstract classes do not exist by default in Javascript: we force it by throwing errors in the constructor
 * and in methods to implement
 */
export default class BaseShape {

    #currentShape: Array<Array<number>>;
    #rotation: number;
    position: Object;

    constructor() {
        if (this.constructor === BaseShape)
            throw new Error("Abstract class can't be instantiated");
        this.#rotation = 0;
        this.position = {x: 0, y: 0};
        this.#currentShape = this.getShapes()[this.#rotation];
    }

    getColor(): string {
        throw new Error("Method 'getColor()' must be implemented");
    }

    getShapes(): Array<Array<Array<number>>> {
        throw new Error("Method 'getShapes()' must be implemented");
    }

    getCurrentShape() {
        return this.#currentShape;
    }

    getCellsCoordinates(isAbsolute: boolean) {
        let coordinates = [];
        for (let row = 0; row < this.#currentShape.length; row++) {
            for (let col = 0; col < this.#currentShape[row].length; col++) {
                if (this.#currentShape[row][col] === 1)
                    if (isAbsolute)
                        coordinates.push({x: this.position.x + col, y: this.position.y + row});
                    else
                        coordinates.push({x: col, y: row});
            }
        }
        return coordinates;
    }

    rotate(isForward: boolean) {
        if (isForward)
            this.#rotation++;
        else
            this.#rotation--;
        if (this.#rotation > 3)
            this.#rotation = 0;
        else if (this.#rotation < 0)
            this.#rotation = 3;
        this.#currentShape = this.getShapes()[this.#rotation];
    }

    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;
    }

}
