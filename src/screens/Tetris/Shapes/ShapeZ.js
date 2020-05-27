// @flow

import BaseShape from "./BaseShape";

export default class ShapeZ extends BaseShape {

    #colors: Object;

    constructor(colors: Object) {
        super();
        this.position.x = 3;
        this.#colors = colors;
    }

    getColor(): string {
        return this.#colors.tetrisZ;
    }

    getShapes() {
        return [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0],
            ],
        ];
    }
}
