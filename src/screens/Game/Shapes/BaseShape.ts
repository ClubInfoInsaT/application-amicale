/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

// @flow

export type CoordinatesType = {
  x: number;
  y: number;
};

export type ShapeType = Array<Array<number>>;

/**
 * Abstract class used to represent a BaseShape.
 * Abstract classes do not exist by default in Javascript: we force it by throwing errors in the constructor
 * and in methods to implement
 */
export default class BaseShape {
  #currentShape: ShapeType;

  #rotation: number;

  position: CoordinatesType;

  theme: ReactNativePaper.Theme;

  /**
   * Prevent instantiation if classname is BaseShape to force class to be abstract
   */
  constructor(theme: ReactNativePaper.Theme) {
    if (this.constructor === BaseShape) {
      throw new Error("Abstract class can't be instantiated");
    }
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
  getShapes(): Array<ShapeType> {
    throw new Error("Method 'getShapes()' must be implemented");
  }

  /**
   * Gets this object's current shape.
   */
  getCurrentShape(): ShapeType {
    return this.#currentShape;
  }

  /**
   * Gets this object's coordinates.
   * This will return an array of coordinates representing the positions of the cells used by this object.
   *
   * @param isAbsolute Should we take into account the current position of the object?
   * @return {Array<CoordinatesType>} This object cells coordinates
   */
  getCellsCoordinates(isAbsolute: boolean): Array<CoordinatesType> {
    const coordinates = [];
    for (let row = 0; row < this.#currentShape.length; row += 1) {
      for (let col = 0; col < this.#currentShape[row].length; col += 1) {
        if (this.#currentShape[row][col] === 1) {
          if (isAbsolute) {
            coordinates.push({
              x: this.position.x + col,
              y: this.position.y + row,
            });
          } else {
            coordinates.push({x: col, y: row});
          }
        }
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
    if (isForward) {
      this.#rotation += 1;
    } else {
      this.#rotation -= 1;
    }
    if (this.#rotation > 3) {
      this.#rotation = 0;
    } else if (this.#rotation < 0) {
      this.#rotation = 3;
    }
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
