// @flow

import BaseShape from "./BaseShape";

export default class ShapeO extends BaseShape {

    #colors: Object;

    constructor(colors: Object) {
        super();
        this.position.x = 4;
        this.#colors = colors;
    }

    getColor(): string {
        return this.#colors.tetrisO;
    }

    getShapes() {
        return [
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 1],
            ],
        ];
    }
}
