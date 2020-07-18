// @flow

import BaseShape from "./BaseShape";
import type {CustomTheme} from "../../../managers/ThemeManager";

export default class ShapeI extends BaseShape {

    constructor(theme: CustomTheme) {
        super(theme);
        this.position.x = 3;
    }

    getColor(): string {
        return this.theme.colors.tetrisI;
    }

    getShapes() {
        return [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
        ];
    }
}
