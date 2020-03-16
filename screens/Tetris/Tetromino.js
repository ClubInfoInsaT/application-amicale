export default class Tetromino {

    static types = {
        'I': 0,
        'O': 1,
        'T': 2,
        'S': 3,
        'Z': 4,
        'J': 5,
        'L': 6,
    };

    static shapes = {
        0: [
            [1, 1, 1, 1]
        ],
        1: [
            [1, 1],
            [1, 1]
        ],
        2: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        3: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        4: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        5: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        6: [
            [0, 0, 1],
            [1, 1, 1],
        ],
    };

    static colors: Object;

    currentType: Object;
    currentShape: Object;
    currentRotation: number;
    position: Object;
    colors: Object;

    constructor(type: Tetromino.types, colors: Object) {
        this.currentType = type;
        this.currentShape = Tetromino.shapes[type];
        this.currentRotation = 0;
        this.position = {x: 0, y: 0};
        if (this.currentType === Tetromino.types.O)
            this.position.x = 4;
        else
            this.position.x = 3;
        this.colors = colors;
        Tetromino.colors = {
            0: colors.tetrisI,
            1: colors.tetrisO,
            2: colors.tetrisT,
            3: colors.tetrisS,
            4: colors.tetrisZ,
            5: colors.tetrisJ,
            6: colors.tetrisL,
        };
    }

    getColor() {
        return Tetromino.colors[this.currentType];
    }

    getCellsCoordinates() {
        let coordinates = [];
        for (let row = 0; row < this.currentShape.length; row++) {
            for (let col = 0; col < this.currentShape[row].length; col++) {
                if (this.currentShape[row][col] === 1)
                    coordinates.push({x: this.position.x + col, y: this.position.y + row});
            }
        }
        return coordinates;
    }

    rotate(isForward) {
        this.currentRotation++;
        if (this.currentRotation > 3)
            this.currentRotation = 0;

        if (this.currentRotation === 0) {
            this.currentShape = Tetromino.shapes[this.currentType];
        } else {
            let result = [];
            for(let i = 0; i < this.currentShape[0].length; i++) {
                let row = this.currentShape.map(e => e[i]);

                if (isForward)
                    result.push(row.reverse());
                else
                    result.push(row);
            }
            this.currentShape = result;
        }

    }

    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;
    }

}
