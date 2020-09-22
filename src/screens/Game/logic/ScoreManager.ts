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

/**
 * Class used to manage game score
 */
export default class ScoreManager {
  #scoreLinesModifier = [40, 100, 300, 1200];

  #score: number;

  #level: number;

  #levelProgression: number;

  /**
   * Initializes score to 0
   */
  constructor() {
    this.#score = 0;
    this.#level = 0;
    this.#levelProgression = 0;
  }

  /**
   * Gets the current score
   *
   * @return {number} The current score
   */
  getScore(): number {
    return this.#score;
  }

  /**
   * Gets the current level
   *
   * @return {number} The current level
   */
  getLevel(): number {
    return this.#level;
  }

  /**
   * Gets the current level progression
   *
   * @return {number} The current level progression
   */
  getLevelProgression(): number {
    return this.#levelProgression;
  }

  /**
   * Increments the score by one
   */
  incrementScore() {
    this.#score += 1;
  }

  /**
   * Add score corresponding to the number of lines removed at the same time.
   * Also updates the level progression.
   *
   * The more lines cleared at the same time, the more points and level progression the player gets.
   *
   * @param numberRemoved The number of lines removed at the same time
   */
  addLinesRemovedPoints(numberRemoved: number) {
    if (numberRemoved < 1 || numberRemoved > 4) {
      return;
    }
    this.#score +=
      this.#scoreLinesModifier[numberRemoved - 1] * (this.#level + 1);
    switch (numberRemoved) {
      case 1:
        this.#levelProgression += 1;
        break;
      case 2:
        this.#levelProgression += 3;
        break;
      case 3:
        this.#levelProgression += 5;
        break;
      case 4: // Did a tetris !
        this.#levelProgression += 8;
        break;
      default:
        break;
    }
  }

  /**
   * Checks if the player can go to the next level.
   *
   * If he can, change the level.
   *
   * @return {boolean} True if the current level has changed
   */
  canLevelUp(): boolean {
    const canLevel = this.#levelProgression > this.#level * 5;
    if (canLevel) {
      this.#levelProgression -= this.#level * 5;
      this.#level += 1;
    }
    return canLevel;
  }
}
