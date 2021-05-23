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
import GridManager from './GridManager';
import type { GridType } from '../components/GridComponent';

export type TickCallbackType = (
  score: number,
  level: number,
  grid: GridType
) => void;

export type ClockCallbackType = (time: number) => void;

export type EndCallbackType = (
  time: number,
  score: number,
  isRestart: boolean
) => void;

export type MovementCallbackType = (grid: GridType, score?: number) => void;

export default class GameLogic {
  static levelTicks = [1000, 800, 600, 400, 300, 200, 150, 100];

  scoreManager: ScoreManager;

  gridManager: GridManager;

  height: number;

  width: number;

  gameRunning: boolean;

  gamePaused: boolean;

  gameTime: number;

  currentObject?: Piece;

  gameTick: number;

  gameTickInterval?: NodeJS.Timeout;

  gameTimeInterval?: NodeJS.Timeout;

  pressInInterval?: NodeJS.Timeout;

  isPressedIn: boolean;

  autoRepeatActivationDelay: number;

  autoRepeatDelay: number;

  nextPieces: Array<Piece>;

  nextPiecesCount: number;

  tickCallback?: TickCallbackType;

  clockCallback?: ClockCallbackType;

  endCallback?: EndCallbackType;

  theme: ReactNativePaper.Theme;

  constructor(height: number, width: number, theme: ReactNativePaper.Theme) {
    this.gameTime = 0;
    this.gameTick = 0;
    this.isPressedIn = false;

    this.height = height;
    this.width = width;
    this.gameRunning = false;
    this.gamePaused = false;
    this.theme = theme;
    this.autoRepeatActivationDelay = 300;
    this.autoRepeatDelay = 50;
    this.nextPieces = [];
    this.nextPiecesCount = 3;
    this.scoreManager = new ScoreManager();
    this.gridManager = new GridManager(
      this.getWidth(),
      this.getHeight(),
      this.theme
    );
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  getCurrentGrid(): GridType {
    return this.gridManager.getCurrentGrid();
  }

  isGamePaused(): boolean {
    return this.gamePaused;
  }

  onFreeze = () => {
    if (this.currentObject) {
      this.gridManager.freezeTetromino(this.currentObject, this.scoreManager);
    }
    this.createTetromino();
  };

  setNewGameTick(level: number) {
    if (level >= GameLogic.levelTicks.length) {
      return;
    }
    this.gameTick = GameLogic.levelTicks[level];
    this.stopTick();
    this.startTick();
  }

  startClock() {
    this.gameTimeInterval = setInterval(() => {
      this.onClock(this.clockCallback);
    }, 1000);
  }

  startTick() {
    this.gameTickInterval = setInterval(() => {
      this.onTick(this.tickCallback);
    }, this.gameTick);
  }

  stopClock() {
    if (this.gameTimeInterval) {
      clearInterval(this.gameTimeInterval);
    }
  }

  stopTick() {
    if (this.gameTickInterval) {
      clearInterval(this.gameTickInterval);
    }
  }

  stopGameTime() {
    this.stopClock();
    this.stopTick();
  }

  startGameTime() {
    this.startClock();
    this.startTick();
  }

  onTick(callback?: TickCallbackType) {
    if (this.currentObject) {
      this.currentObject.tryMove(
        0,
        1,
        this.gridManager.getCurrentGrid(),
        this.getWidth(),
        this.getHeight(),
        this.onFreeze
      );
    }
    if (callback) {
      callback(
        this.scoreManager.getScore(),
        this.scoreManager.getLevel(),
        this.gridManager.getCurrentGrid()
      );
    }
    if (this.scoreManager.canLevelUp()) {
      this.setNewGameTick(this.scoreManager.getLevel());
    }
  }

  onClock(callback?: ClockCallbackType) {
    this.gameTime += 1;
    if (callback) {
      callback(this.gameTime);
    }
  }

  canUseInput(): boolean {
    return this.gameRunning && !this.gamePaused;
  }

  rightPressed(callback: MovementCallbackType) {
    this.isPressedIn = true;
    this.movePressedRepeat(true, callback, 1, 0);
  }

  leftPressedIn(callback: MovementCallbackType) {
    this.isPressedIn = true;
    this.movePressedRepeat(true, callback, -1, 0);
  }

  downPressedIn(callback: MovementCallbackType) {
    this.isPressedIn = true;
    this.movePressedRepeat(true, callback, 0, 1);
  }

  movePressedRepeat(
    isInitial: boolean,
    callback: MovementCallbackType,
    x: number,
    y: number
  ) {
    if (!this.canUseInput() || !this.isPressedIn) {
      return;
    }
    const moved =
      this.currentObject &&
      this.currentObject.tryMove(
        x,
        y,
        this.gridManager.getCurrentGrid(),
        this.getWidth(),
        this.getHeight(),
        this.onFreeze
      );
    if (moved) {
      if (y === 1) {
        this.scoreManager.incrementScore();
        callback(
          this.gridManager.getCurrentGrid(),
          this.scoreManager.getScore()
        );
      } else {
        callback(this.gridManager.getCurrentGrid());
      }
    }
    this.pressInInterval = setTimeout(
      () => {
        this.movePressedRepeat(false, callback, x, y);
      },
      isInitial ? this.autoRepeatActivationDelay : this.autoRepeatDelay
    );
  }

  pressedOut() {
    this.isPressedIn = false;
    if (this.pressInInterval) {
      clearTimeout(this.pressInInterval);
    }
  }

  rotatePressed(callback: MovementCallbackType) {
    if (!this.canUseInput()) {
      return;
    }

    if (
      this.currentObject &&
      this.currentObject.tryRotate(
        this.gridManager.getCurrentGrid(),
        this.getWidth(),
        this.getHeight()
      )
    ) {
      callback(this.gridManager.getCurrentGrid());
    }
  }

  getNextPiecesPreviews(): Array<GridType> {
    const finalArray = [];
    for (let i = 0; i < this.nextPieces.length; i += 1) {
      const gridSize = this.nextPieces[i]
        .getCurrentShape()
        .getCurrentShape()[0].length;
      finalArray.push(this.gridManager.getEmptyGrid(gridSize, gridSize));
      this.nextPieces[i].toGrid(finalArray[i], true);
    }
    return finalArray;
  }

  recoverNextPiece() {
    const next = this.nextPieces.shift();
    if (next) {
      this.currentObject = next;
    }
    this.generateNextPieces();
  }

  generateNextPieces() {
    while (this.nextPieces.length < this.nextPiecesCount) {
      this.nextPieces.push(new Piece(this.theme));
    }
  }

  createTetromino() {
    this.pressedOut();
    this.recoverNextPiece();
    if (
      this.currentObject &&
      !this.currentObject.isPositionValid(
        this.gridManager.getCurrentGrid(),
        this.getWidth(),
        this.getHeight()
      )
    ) {
      this.endGame(false);
    }
  }

  togglePause() {
    if (!this.gameRunning) {
      return;
    }
    this.gamePaused = !this.gamePaused;
    if (this.gamePaused) {
      this.stopGameTime();
    } else {
      this.startGameTime();
    }
  }

  endGame(isRestart: boolean) {
    this.gameRunning = false;
    this.gamePaused = false;
    this.stopGameTime();
    if (this.endCallback) {
      this.endCallback(this.gameTime, this.scoreManager.getScore(), isRestart);
    }
  }

  startGame(
    tickCallback: TickCallbackType,
    clockCallback: ClockCallbackType,
    endCallback: EndCallbackType
  ) {
    if (this.gameRunning) {
      this.endGame(true);
    }
    this.gameRunning = true;
    this.gamePaused = false;
    this.gameTime = 0;
    this.scoreManager = new ScoreManager();
    this.gameTick = GameLogic.levelTicks[this.scoreManager.getLevel()];
    this.gridManager = new GridManager(
      this.getWidth(),
      this.getHeight(),
      this.theme
    );
    this.nextPieces = [];
    this.generateNextPieces();
    this.createTetromino();
    tickCallback(
      this.scoreManager.getScore(),
      this.scoreManager.getLevel(),
      this.gridManager.getCurrentGrid()
    );
    clockCallback(this.gameTime);
    this.startTick();
    this.startClock();
    this.tickCallback = tickCallback;
    this.clockCallback = clockCallback;
    this.endCallback = endCallback;
  }
}
