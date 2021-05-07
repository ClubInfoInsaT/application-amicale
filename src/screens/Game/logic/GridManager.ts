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

import Piece from './Piece';
import ScoreManager from './ScoreManager';
import type { CoordinatesType } from '../Shapes/BaseShape';
import type { GridType } from '../components/GridComponent';
import type { CellType } from '../components/CellComponent';

/**
 * Class used to manage the game grid
 */
export default class GridManager {
  #currentGrid: GridType;

  #theme: ReactNativePaper.Theme;

  /**
   * Initializes a grid of the given size
   *
   * @param width The grid width
   * @param height The grid height
   * @param theme Object containing current theme
   */
  constructor(width: number, height: number, theme: ReactNativePaper.Theme) {
    this.#theme = theme;
    this.#currentGrid = this.getEmptyGrid(height, width);
  }

  /**
   * Get the current grid
   *
   * @return {GridType} The current grid
   */
  getCurrentGrid(): GridType {
    return this.#currentGrid;
  }

  /**
   * Get a new empty grid line of the given size
   *
   * @param width The line size
   * @return {Array<CellType>}
   */
  getEmptyLine(width: number): Array<CellType> {
    const line = [];
    for (let col = 0; col < width; col += 1) {
      line.push({
        color: this.#theme.colors.tetrisBackground,
        isEmpty: true,
        key: col.toString(),
      });
    }
    return line;
  }

  /**
   * Gets a new empty grid
   *
   * @param width The grid width
   * @param height The grid height
   * @return {GridType} A new empty grid
   */
  getEmptyGrid(height: number, width: number): GridType {
    const grid = [];
    for (let row = 0; row < height; row += 1) {
      grid.push(this.getEmptyLine(width));
    }
    return grid;
  }

  /**
   * Removes the given lines from the grid,
   * shifts down every line on top and adds new empty lines on top.
   *
   * @param lines An array of line numbers to remove
   * @param scoreManager A reference to the score manager
   */
  clearLines(lines: Array<number>, scoreManager: ScoreManager) {
    lines.sort();
    for (let i = 0; i < lines.length; i += 1) {
      this.#currentGrid.splice(lines[i], 1);
      this.#currentGrid.unshift(this.getEmptyLine(this.#currentGrid[0].length));
    }
    scoreManager.addLinesRemovedPoints(lines.length);
  }

  /**
   * Gets the lines to clear around the given piece's coordinates.
   * The piece's coordinates are used for optimization and to prevent checking the whole grid.
   *
   * @param pos The piece's coordinates to check lines at
   * @return {Array<number>} An array containing the line numbers to clear
   */
  getLinesToClear(pos: Array<CoordinatesType>): Array<number> {
    const rows = [];
    for (let i = 0; i < pos.length; i += 1) {
      let isLineFull = true;
      for (let col = 0; col < this.#currentGrid[pos[i].y].length; col += 1) {
        if (this.#currentGrid[pos[i].y][col].isEmpty) {
          isLineFull = false;
          break;
        }
      }
      if (isLineFull && rows.indexOf(pos[i].y) === -1) {
        rows.push(pos[i].y);
      }
    }
    return rows;
  }

  /**
   * Freezes the given piece to the grid
   *
   * @param currentObject The piece to freeze
   * @param scoreManager A reference to the score manager
   */
  freezeTetromino(currentObject: Piece, scoreManager: ScoreManager) {
    this.clearLines(
      this.getLinesToClear(currentObject.getCoordinates()),
      scoreManager
    );
  }
}
