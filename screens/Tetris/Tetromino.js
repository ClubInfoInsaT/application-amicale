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

    static shapes = [
        [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
        ],
        [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ],
        ],
        [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
        ],
        [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            [
                [1, 1],
                [1, 1],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        ],
    ];

    static colors: Object;

    currentType: Object;
    currentShape: Object;
    currentRotation: number;
    position: Object;
    colors: Object;

    constructor(type: Tetromino.types, colors: Object) {
        this.currentType = type;
        this.currentRotation = 0;
        this.currentShape = Tetromino.shapes[this.currentRotation][type];
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

    getCellsCoordinates(isAbsolute: boolean) {
        let coordinates = [];
        for (let row = 0; row < this.currentShape.length; row++) {
            for (let col = 0; col < this.currentShape[row].length; col++) {
                if (this.currentShape[row][col] === 1)
                    if (isAbsolute)
                        coordinates.push({x: this.position.x + col, y: this.position.y + row});
                    else
                        coordinates.push({x: col, y: row});
            }
        }
        return coordinates;
    }

    rotate(isForward) {
        if (isForward)
            this.currentRotation++;
        else
            this.currentRotation--;
        if (this.currentRotation > 3)
            this.currentRotation = 0;
        else if (this.currentRotation < 0)
            this.currentRotation = 3;
        this.currentShape = Tetromino.shapes[this.currentRotation][this.currentType];
    }

    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;
    }

}
