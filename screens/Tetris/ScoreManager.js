// @flow

export default class ScoreManager {

    #scoreLinesModifier = [40, 100, 300, 1200];

    #score: number;
    #level: number;
    #levelProgression: number;

    constructor() {
        this.#score = 0;
        this.#level = 0;
        this.#levelProgression = 0;
    }

    getScore(): number {
        return this.#score;
    }

    getLevel(): number {
        return this.#level;
    }

    getLevelProgression(): number {
        return this.#levelProgression;
    }

    incrementScore() {
        this.#score++;
    }

    addLinesRemovedPoints(numberRemoved: number) {
        if (numberRemoved < 1 || numberRemoved > 4)
            return 0;
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

    canLevelUp() {
        let canLevel = this.#levelProgression > this.#level * 5;
        if (canLevel){
            this.#levelProgression -= this.#level * 5;
            this.#level++;
        }
        return canLevel;
    }

}
