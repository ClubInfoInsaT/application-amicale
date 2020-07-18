// @flow

import BaseShape from "./BaseShape";
import type {CustomTheme} from "../../../managers/ThemeManager";

export default class ShapeO extends BaseShape {

    constructor(theme: CustomTheme) {
        super(theme);
        this.position.x = 4;
    }

    getColor(): string {
        return this.theme.colors.tetrisO;
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
