// @flow

import Tetromino from "./Tetromino";

export default class GameLogic {

    currentGrid: Array<Array<Object>>;

    height: number;
    width: number;

    gameRunning: boolean;
    gameTime: number;
    score: number;

    currentObject: Tetromino;

    gameTick: number;
    gameTickInterval: IntervalID;

    onTick: Function;
    endCallback: Function;

    colors: Object;

    constructor(height: number, width: number, colors: Object) {
        this.height = height;
        this.width = width;
        this.gameRunning = false;
        this.gameTick = 1000;
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

    getEmptyGrid() {
        let grid = [];
        for (let row = 0; row < this.getHeight(); row++) {
            grid.push([]);
            for (let col = 0; col < this.getWidth(); col++) {
                grid[row].push({
                    color: this.colors.tetrisBackground,
                    isEmpty: true,
                });
            }
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
        }
    }

    tryRotateTetromino() {
        this.currentObject.rotate(true);
        if (!this.isTetrominoPositionValid())
            this.currentObject.rotate(false);
    }

    onTick(callback: Function) {
        this.gameTime++;
        this.score++;
        this.tryMoveTetromino(0, 1);
        callback(this.gameTime, this.score, this.getFinalGrid());
    }

    rightPressed(callback: Function) {
        this.tryMoveTetromino(1, 0);
        callback(this.getFinalGrid());
    }

    leftPressed(callback: Function) {
        this.tryMoveTetromino(-1, 0);
        callback(this.getFinalGrid());
    }

    rotatePressed(callback: Function) {
        this.tryRotateTetromino();
        callback(this.getFinalGrid());
    }

    createTetromino() {
        let shape = Math.floor(Math.random() * 7);
        this.currentObject = new Tetromino(shape, this.colors);
        if (!this.isTetrominoPositionValid())
            this.endGame();
    }

    endGame() {
        console.log('Game Over!');
        this.gameRunning = false;
        clearInterval(this.gameTickInterval);
        this.endCallback(this.gameTime, this.score);
    }

    startGame(tickCallback: Function, endCallback: Function) {
        if (this.gameRunning)
            return;
        this.gameRunning = true;
        this.gameTime = 0;
        this.score = 0;
        this.currentGrid = this.getEmptyGrid();
        this.createTetromino();
        tickCallback(this.gameTime, this.score, this.getFinalGrid());
        this.onTick = this.onTick.bind(this, tickCallback);
        this.gameTickInterval = setInterval(this.onTick, this.gameTick);
        this.endCallback = endCallback;
    }

}
