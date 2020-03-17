// @flow

import Tetromino from "./Tetromino";

export default class GameLogic {

    static levelTicks = [
        1000,
        800,
        600,
        400,
        300,
        200,
        150,
        100,
    ];

    static scoreLinesModifier = [40, 100, 300, 1200];

    currentGrid: Array<Array<Object>>;

    height: number;
    width: number;

    gameRunning: boolean;
    gamePaused: boolean;
    gameTime: number;
    score: number;
    level: number;

    currentObject: Tetromino;

    gameTick: number;
    gameTickInterval: IntervalID;
    gameTimeInterval: IntervalID;

    pressInInterval: TimeoutID;
    isPressedIn: boolean;
    autoRepeatActivationDelay: number;
    autoRepeatDelay: number;


    onTick: Function;
    onClock: Function;
    endCallback: Function;

    colors: Object;

    levelProgression: number;

    constructor(height: number, width: number, colors: Object) {
        this.height = height;
        this.width = width;
        this.gameRunning = false;
        this.gamePaused = false;
        this.colors = colors;
        this.autoRepeatActivationDelay = 300;
        this.autoRepeatDelay = 100;
    }

    getHeight(): number {
        return this.height;
    }

    getWidth(): number {
        return this.width;
    }

    isGameRunning(): boolean {
        return this.gameRunning;
    }

    isGamePaused(): boolean {
        return this.gamePaused;
    }

    getEmptyLine() {
        let line = [];
        for (let col = 0; col < this.getWidth(); col++) {
            line.push({
                color: this.colors.tetrisBackground,
                isEmpty: true,
            });
        }
        return line;
    }

    getEmptyGrid() {
        let grid = [];
        for (let row = 0; row < this.getHeight(); row++) {
            grid.push(this.getEmptyLine());
        }
        return grid;
    }

    getGridCopy() {
        return JSON.parse(JSON.stringify(this.currentGrid));
    }

    getFinalGrid() {
        let coord = this.currentObject.getCellsCoordinates();
        let finalGrid = this.getGridCopy();
        for (let i = 0; i < coord.length; i++) {
            finalGrid[coord[i].y][coord[i].x] = {
                color: this.currentObject.getColor(),
                isEmpty: false,
            };
        }
        return finalGrid;
    }

    getLinesRemovedPoints(numberRemoved: number) {
        if (numberRemoved < 1 || numberRemoved > 4)
            return 0;
        return GameLogic.scoreLinesModifier[numberRemoved-1] * (this.level + 1);
    }

    canLevelUp() {
        return this.levelProgression > this.level * 5;
    }

    freezeTetromino() {
        let coord = this.currentObject.getCellsCoordinates();
        for (let i = 0; i < coord.length; i++) {
            this.currentGrid[coord[i].y][coord[i].x] = {
                color: this.currentObject.getColor(),
                isEmpty: false,
            };
        }
        this.clearLines(this.getLinesToClear(coord));
    }

    clearLines(lines: Array<number>) {
        lines.sort();
        for (let i = 0; i < lines.length; i++) {
            this.currentGrid.splice(lines[i], 1);
            this.currentGrid.unshift(this.getEmptyLine());
        }
        switch (lines.length) {
            case 1:
                this.levelProgression += 1;
                break;
            case 2:
                this.levelProgression += 3;
                break;
            case 3:
                this.levelProgression += 5;
                break;
            case 4: // Did a tetris !
                this.levelProgression += 8;
                break;
        }
        this.score += this.getLinesRemovedPoints(lines.length);
    }

    getLinesToClear(coord: Object) {
        let rows = [];
        for (let i = 0; i < coord.length; i++) {
            let isLineFull = true;
            for (let col = 0; col < this.getWidth(); col++) {
                if (this.currentGrid[coord[i].y][col].isEmpty) {
                    isLineFull = false;
                    break;
                }
            }
            if (isLineFull && rows.indexOf(coord[i].y) === -1)
                rows.push(coord[i].y);
        }
        return rows;
    }

    isTetrominoPositionValid() {
        let isValid = true;
        let coord = this.currentObject.getCellsCoordinates();
        for (let i = 0; i < coord.length; i++) {
            if (coord[i].x >= this.getWidth()
                || coord[i].x < 0
                || coord[i].y >= this.getHeight()
                || coord[i].y < 0
                || !this.currentGrid[coord[i].y][coord[i].x].isEmpty) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    tryMoveTetromino(x: number, y: number) {
        if (x > 1) x = 1; // Prevent moving from more than one tile
        if (x < -1) x = -1;
        if (y > 1) y = 1;
        if (y < -1) y = -1;
        if (x !== 0 && y !== 0) y = 0; // Prevent diagonal movement

        this.currentObject.move(x, y);
        let isValid = this.isTetrominoPositionValid();

        if (!isValid && x !== 0)
            this.currentObject.move(-x, 0);
        else if (!isValid && y !== 0) {
            this.currentObject.move(0, -y);
            this.freezeTetromino();
            this.createTetromino();
        } else
            return true;
        return false;
    }

    tryRotateTetromino() {
        this.currentObject.rotate(true);
        if (!this.isTetrominoPositionValid()) {
            this.currentObject.rotate(false);
            return false;
        }
        return true;
    }

    setNewGameTick(level: number) {
        if (level >= GameLogic.levelTicks.length)
            return;
        this.gameTick = GameLogic.levelTicks[level];
        clearInterval(this.gameTickInterval);
        this.gameTickInterval = setInterval(this.onTick, this.gameTick);
    }

    onTick(callback: Function) {
        this.tryMoveTetromino(0, 1);
        callback(this.score, this.level, this.getFinalGrid());
        if (this.canLevelUp()) {
            this.level++;
            this.setNewGameTick(this.level);
        }
    }

    onClock(callback: Function) {
        this.gameTime++;
        callback(this.gameTime);
    }

    canUseInput() {
        return this.gameRunning && !this.gamePaused
    }

    rightPressed(callback: Function) {
        this.isPressedIn = true;
        this.movePressedRepeat(true, callback, 1, 0);
    }

    leftPressedIn(callback: Function) {
        this.isPressedIn = true;
        this.movePressedRepeat(true, callback, -1, 0);
    }

    downPressedIn(callback: Function) {
        this.isPressedIn = true;
        this.movePressedRepeat(true, callback, 0, 1);
    }

    movePressedRepeat(isInitial: boolean, callback: Function, x: number, y: number) {
        if (!this.canUseInput() || !this.isPressedIn)
            return;

        if (this.tryMoveTetromino(x, y)) {
            if (y === 1) {
                this.score++;
                callback(this.getFinalGrid(), this.score);
            } else
                callback(this.getFinalGrid());
        }
        this.pressInInterval = setTimeout(() => this.movePressedRepeat(false, callback, x, y), isInitial ? this.autoRepeatActivationDelay : this.autoRepeatDelay);
    }

    pressedOut() {
        this.isPressedIn = false;
        clearTimeout(this.pressInInterval);
    }

    rotatePressed(callback: Function) {
        if (!this.canUseInput())
            return;

        if (this.tryRotateTetromino())
            callback(this.getFinalGrid());
    }

    createTetromino() {
        this.pressedOut();
        let shape = Math.floor(Math.random() * 7);
        this.currentObject = new Tetromino(shape, this.colors);
        if (!this.isTetrominoPositionValid())
            this.endGame(false);
    }

    togglePause() {
        if (!this.gameRunning)
            return;
        this.gamePaused = !this.gamePaused;
        if (this.gamePaused) {
            clearInterval(this.gameTickInterval);
            clearInterval(this.gameTimeInterval);
        } else {
            this.gameTickInterval = setInterval(this.onTick, this.gameTick);
            this.gameTimeInterval = setInterval(this.onClock, 1000);
        }
    }

    endGame(isRestart: boolean) {
        this.gameRunning = false;
        this.gamePaused = false;
        clearInterval(this.gameTickInterval);
        clearInterval(this.gameTimeInterval);
        this.endCallback(this.gameTime, this.score, isRestart);
    }

    startGame(tickCallback: Function, clockCallback: Function, endCallback: Function) {
        if (this.gameRunning)
            this.endGame(true);
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameTime = 0;
        this.score = 0;
        this.level = 0;
        this.levelProgression = 0;
        this.gameTick = GameLogic.levelTicks[this.level];
        this.currentGrid = this.getEmptyGrid();
        this.createTetromino();
        tickCallback(this.score, this.level, this.getFinalGrid());
        clockCallback(this.gameTime);
        this.onTick = this.onTick.bind(this, tickCallback);
        this.onClock = this.onClock.bind(this, clockCallback);
        this.gameTickInterval = setInterval(this.onTick, this.gameTick);
        this.gameTimeInterval = setInterval(this.onClock, 1000);
        this.endCallback = endCallback;
    }

}
