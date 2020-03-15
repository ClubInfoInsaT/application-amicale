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

    static colors = {
        0: '#00f8ff',
        1: '#ffe200',
        2: '#b817ff',
        3: '#0cff34',
        4: '#ff000b',
        5: '#1000ff',
        6: '#ff9400',
    }


    currentType: Tetromino.types;
    position: Object;

    constructor(type: Tetromino.types) {
        this.currentType = type;
        this.position = {x: 0, y: 0};
    }

    getColor() {
        return Tetromino.colors[this.currentType];
    }

    getCellsCoordinates() {
        let coordinates = [];
        for (let row = 0; row < Tetromino.shapes[this.currentType].length; row++) {
            for (let col = 0; col < Tetromino.shapes[this.currentType][row].length; col++) {
                if (Tetromino.shapes[this.currentType][row][col] === 1)
                    coordinates.push({x: this.position.x + col, y: this.position.y + row});
            }
        }
        return coordinates;
    }

    move(x: number, y: number) {
        this.position.x += x;
        this.position.y += y;
    }

}
