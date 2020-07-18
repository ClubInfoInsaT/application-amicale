// @flow

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
        this.#score++;
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
        if (numberRemoved < 1 || numberRemoved > 4)
            return;
        this.#score += this.#scoreLinesModifier[numberRemoved-1] * (this.#level + 1);
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
        }
    }

    /**
     * Checks if the player can go to the next level.
     *
     * If he can, change the level.
     *
     * @return {boolean} True if the current level has changed
     */
    canLevelUp() {
        let canLevel = this.#levelProgression > this.#level * 5;
        if (canLevel){
            this.#levelProgression -= this.#level * 5;
            this.#level++;
        }
        return canLevel;
    }

}
