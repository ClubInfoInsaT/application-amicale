// @flow

import Tetromino from "./Tetromino";

export default class GameLogic {

    static levelTicks = {
        '1': 1000,
        '2': 900,
        '3': 800,
        '4': 700,
        '5': 600,
        '6': 500,
        '7': 400,
        '8': 300,
        '9': 200,
        '10': 150,
    };

    static levelThresholds = {
        '1': 100,
        '2': 300,
        '3': 500,
        '4': 700,
        '5': 1000,
        '7': 1500,
        '8': 2000,
        '9': 3000,
        '10': 4000,
        '11': 5000,
    };

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

    onTick: Function;
    onClock: Function;
    endCallback: Function;

    colors: Object;

    constructor(height: number, width: number, colors: Object) {
        this.height = height;
        this.width = width;
        this.gameRunning = false;
        this.gamePaused = false;
        this.colors = colors;
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
            this.score += 100;
        }
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
        if (!this.isTetrominoPositionValid())
            this.currentObject.rotate(false);
    }

    setNewGameTick(level: number) {
        if (level > 10)
            return;
        this.gameTick = GameLogic.levelTicks[level];
        clearInterval(this.gameTickInterval);
        this.gameTickInterval = setInterval(this.onTick, this.gameTick);
    }

    onTick(callback: Function) {
        this.tryMoveTetromino(0, 1);
        callback(this.score, this.level, this.getFinalGrid());
        if (this.level <= 10 && this.score > GameLogic.levelThresholds[this.level]) {
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
        if (!this.canUseInput())
            return;

        if (this.tryMoveTetromino(1, 0))
            callback(this.getFinalGrid());
    }

    leftPressed(callback: Function) {
        if (!this.canUseInput())
            return;

        if (this.tryMoveTetromino(-1, 0))
            callback(this.getFinalGrid());
    }

    downPressed(callback: Function) {
        if (!this.canUseInput())
            return;

        if (this.tryMoveTetromino(0, 1)){
            this.score++;
            callback(this.getFinalGrid(), this.score);
        }
    }

    rotatePressed(callback: Function) {
        if (!this.canUseInput())
            return;

        if (this.tryRotateTetromino())
            callback(this.getFinalGrid());
    }

    createTetromino() {
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
        this.level = 1;
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
