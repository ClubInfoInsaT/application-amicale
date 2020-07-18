// @flow

import type {CustomTheme} from "../../../managers/ThemeManager";

export type Coordinates = {
    x: number,
    y: number,
}

type Shape = Array<Array<number>>;

/**
 * Abstract class used to represent a BaseShape.
 * Abstract classes do not exist by default in Javascript: we force it by throwing errors in the constructor
 * and in methods to implement
 */
export default class BaseShape {

    #currentShape: Shape;
    #rotation: number;
    position: Coordinates;
    theme: CustomTheme;

    /**
     * Prevent instantiation if classname is BaseShape to force class to be abstract
     */
    constructor(theme: CustomTheme) {
        if (this.constructor === BaseShape)
            throw new Error("Abstract class can't be instantiated");
        this.theme = theme;
        this.#rotation = 0;
        this.position = {x: 0, y: 0};
        this.#currentShape = this.getShapes()[this.#rotation];
    }

    /**
     * Gets this shape's color.
     * Must be implemented by child class
     */
    getColor(): string {
        throw new Error("Method 'getColor()' must be implemented");
    }

    /**
     * Gets this object's all possible shapes as an array.
     * Must be implemented by child class.
     *
     * Used by tests to read private fields
     */
    getShapes(): Array<Shape> {
        throw new Error("Method 'getShapes()' must be implemented");
    }

    /**
     * Gets this object's current shape.
     *
     * Used by tests to read private fields
     */
    getCurrentShape(): Shape {
        return this.#currentShape;
    }

    /**
     * Gets this object's coordinates.
     * This will return an array of coordinates representing the positions of the cells used by this object.
     *
     * @param isAbsolute Should we take into account the current position of the object?
     * @return {Array<Coordinates>} This object cells coordinates
     */
    getCellsCoordinates(isAbsolute: boolean): Array<Coordinates> {
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

    /**
     * Rotate this object
     *
     * @param isForward Should we rotate clockwise?
     */
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

    /**
     * Move this object
     *
     * @param x Position X offset to add
     * @param y Position Y offset to add
     */
    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;
    }

}
