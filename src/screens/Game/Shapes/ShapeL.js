// @flow

import BaseShape from './BaseShape';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {ShapeType} from './BaseShape';

export default class ShapeL extends BaseShape {
  constructor(theme: CustomThemeType) {
    super(theme);
    this.position.x = 3;
  }

  getColor(): string {
    return this.theme.colors.tetrisL;
  }

  // eslint-disable-next-line class-methods-use-this
  getShapes(): Array<ShapeType> {
    return [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ];
  }
}
