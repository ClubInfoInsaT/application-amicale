// @flow

import BaseShape from './BaseShape';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {ShapeType} from './BaseShape';

export default class ShapeJ extends BaseShape {
  constructor(theme: CustomThemeType) {
    super(theme);
    this.position.x = 3;
  }

  getColor(): string {
    return this.theme.colors.tetrisJ;
  }

  // eslint-disable-next-line class-methods-use-this
  getShapes(): Array<ShapeType> {
    return [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ];
  }
}
