// @flow

import BaseShape from './BaseShape';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {ShapeType} from './BaseShape';

export default class ShapeO extends BaseShape {
  constructor(theme: CustomThemeType) {
    super(theme);
    this.position.x = 4;
  }

  getColor(): string {
    return this.theme.colors.tetrisO;
  }

  // eslint-disable-next-line class-methods-use-this
  getShapes(): Array<ShapeType> {
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
