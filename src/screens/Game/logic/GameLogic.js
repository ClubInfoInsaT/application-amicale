// @flow

import Piece from "./Piece";
import ScoreManager from "./ScoreManager";
import GridManager from "./GridManager";
import type {CustomTheme} from "../../../managers/ThemeManager";

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

    #scoreManager: ScoreManager;
    #gridManager: GridManager;

    #height: number;
    #width: number;

    #gameRunning: boolean;
    #gamePaused: boolean;
    #gameTime: number;

    #currentObject: Piece;

    #gameTick: number;
    #gameTickInterval: IntervalID;
    #gameTimeInterval: IntervalID;

    #pressInInterval: TimeoutID;
    #isPressedIn: boolean;
    #autoRepeatActivationDelay: number;
    #autoRepeatDelay: number;

    #nextPieces: Array<Piece>;
    #nextPiecesCount: number;

    #onTick: Function;
    #onClock: Function;
    endCallback: Function;

    #theme: CustomTheme;

    constructor(height: number, width: number, theme: CustomTheme) {
        this.#height = height;
        this.#width = width;
        this.#gameRunning = false;
        this.#gamePaused = false;
        this.#theme = theme;
        this.#autoRepeatActivationDelay = 300;
        this.#autoRepeatDelay = 50;
        this.#nextPieces = [];
        this.#nextPiecesCount = 3;
        this.#scoreManager = new ScoreManager();
        this.#gridManager = new GridManager(this.getWidth(), this.getHeight(), this.#theme);
    }

    getHeight(): number {
        return this.#height;
    }

    getWidth(): number {
        return this.#width;
    }

    getCurrentGrid() {
        return this.#gridManager.getCurrentGrid();
    }

    isGameRunning(): boolean {
        return this.#gameRunning;
    }

    isGamePaused(): boolean {
        return this.#gamePaused;
    }

    onFreeze() {
        this.#gridManager.freezeTetromino(this.#currentObject, this.#scoreManager);
        this.createTetromino();
    }

    setNewGameTick(level: number) {
        if (level >= GameLogic.levelTicks.length)
            return;
        this.#gameTick = GameLogic.levelTicks[level];
        clearInterval(this.#gameTickInterval);
        this.#gameTickInterval = setInterval(this.#onTick, this.#gameTick);
    }

    onTick(callback: Function) {
        this.#currentObject.tryMove(0, 1,
            this.#gridManager.getCurrentGrid(), this.getWidth(), this.getHeight(),
            () => this.onFreeze());
        callback(
            this.#scoreManager.getScore(),
            this.#scoreManager.getLevel(),
            this.#gridManager.getCurrentGrid());
        if (this.#scoreManager.canLevelUp())
            this.setNewGameTick(this.#scoreManager.getLevel());
    }

    onClock(callback: Function) {
        this.#gameTime++;
        callback(this.#gameTime);
    }

    canUseInput() {
        return this.#gameRunning && !this.#gamePaused
    }

    rightPressed(callback: Function) {
        this.#isPressedIn = true;
        this.movePressedRepeat(true, callback, 1, 0);
    }

    leftPressedIn(callback: Function) {
        this.#isPressedIn = true;
        this.movePressedRepeat(true, callback, -1, 0);
    }

    downPressedIn(callback: Function) {
        this.#isPressedIn = true;
        this.movePressedRepeat(true, callback, 0, 1);
    }

    movePressedRepeat(isInitial: boolean, callback: Function, x: number, y: number) {
        if (!this.canUseInput() || !this.#isPressedIn)
            return;
        const moved = this.#currentObject.tryMove(x, y,
            this.#gridManager.getCurrentGrid(), this.getWidth(), this.getHeight(),
            () => this.onFreeze());
        if (moved) {
            if (y === 1) {
                this.#scoreManager.incrementScore();
                callback(this.#gridManager.getCurrentGrid(), this.#scoreManager.getScore());
            } else
                callback(this.#gridManager.getCurrentGrid());
        }
        this.#pressInInterval = setTimeout(() =>
                this.movePressedRepeat(false, callback, x, y),
            isInitial ? this.#autoRepeatActivationDelay : this.#autoRepeatDelay
        );
    }

    pressedOut() {
        this.#isPressedIn = false;
        clearTimeout(this.#pressInInterval);
    }

    rotatePressed(callback: Function) {
        if (!this.canUseInput())
            return;

        if (this.#currentObject.tryRotate(this.#gridManager.getCurrentGrid(), this.getWidth(), this.getHeight()))
            callback(this.#gridManager.getCurrentGrid());
    }

    getNextPiecesPreviews() {
        let finalArray = [];
        for (let i = 0; i < this.#nextPieces.length; i++) {
            const gridSize = this.#nextPieces[i].getCurrentShape().getCurrentShape()[0].length;
            finalArray.push(this.#gridManager.getEmptyGrid(gridSize, gridSize));
            this.#nextPieces[i].toGrid(finalArray[i], true);
        }

        return finalArray;
    }

    recoverNextPiece() {
        this.#currentObject = this.#nextPieces.shift();
        this.generateNextPieces();
    }

    generateNextPieces() {
        while (this.#nextPieces.length < this.#nextPiecesCount) {
            this.#nextPieces.push(new Piece(this.#theme));
        }
    }

    createTetromino() {
        this.pressedOut();
        this.recoverNextPiece();
        if (!this.#currentObject.isPositionValid(this.#gridManager.getCurrentGrid(), this.getWidth(), this.getHeight()))
            this.endGame(false);
    }

    togglePause() {
        if (!this.#gameRunning)
            return;
        this.#gamePaused = !this.#gamePaused;
        if (this.#gamePaused) {
            clearInterval(this.#gameTickInterval);
            clearInterval(this.#gameTimeInterval);
        } else {
            this.#gameTickInterval = setInterval(this.#onTick, this.#gameTick);
            this.#gameTimeInterval = setInterval(this.#onClock, 1000);
        }
    }

    stopGame() {
        this.#gameRunning = false;
        this.#gamePaused = false;
        clearInterval(this.#gameTickInterval);
        clearInterval(this.#gameTimeInterval);
    }

    endGame(isRestart: boolean) {
        this.stopGame();
        this.endCallback(this.#gameTime, this.#scoreManager.getScore(), isRestart);
    }

    startGame(tickCallback: Function, clockCallback: Function, endCallback: Function) {
        if (this.#gameRunning)
            this.endGame(true);
        this.#gameRunning = true;
        this.#gamePaused = false;
        this.#gameTime = 0;
        this.#scoreManager = new ScoreManager();
        this.#gameTick = GameLogic.levelTicks[this.#scoreManager.getLevel()];
        this.#gridManager = new GridManager(this.getWidth(), this.getHeight(), this.#theme);
        this.#nextPieces = [];
        this.generateNextPieces();
        this.createTetromino();
        tickCallback(
            this.#scoreManager.getScore(),
            this.#scoreManager.getLevel(),
            this.#gridManager.getCurrentGrid());
        clockCallback(this.#gameTime);
        this.#onTick = this.onTick.bind(this, tickCallback);
        this.#onClock = this.onClock.bind(this, clockCallback);
        this.#gameTickInterval = setInterval(this.#onTick, this.#gameTick);
        this.#gameTimeInterval = setInterval(this.#onClock, 1000);
        this.endCallback = endCallback;
    }
}
