// https://www.youtube.com/watch?v=HyK_Q5rrcr4
// https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_010_Maze_DFS/P5
let cols, rows
// セルの正方形一辺
const w = 40

let grid = []

// 現在のセル
let current

// バックトレース用
let stack = []

class Cell {
    constructor(i, j) {
        // col
        this.i = i
        // row
        this.j = j
        // top, right, bottom, left
        this.walls = [true, true, true, true]
        this.visited = false

    }

    show() {
        /*
        lineの説明
        (x,y)-------(x+w,y)
        |             |
        |             |
        (x,y+w)-------(x+w,y+w)
        
        */
        const x = this.i * w
        const y = this.j * w
        stroke(255)
        if (this.walls[0]) {
            line(x, y, x + w, y)
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w)
        }
        if (this.walls[2]) {
            line(x, y + w, x + w, y + w)
        }
        if (this.walls[3]) {
            line(x, y, x, y + w)
        }

        if (this.visited) {
            noStroke()
            fill(255, 0, 255, 100)
            rect(x, y, w, w)
        }
    }


    checkNeighbors() {
        let neighbors = []

        let top = grid[index(this.i, this.j - 1)]
        let right = grid[index(this.i + 1, this.j)]
        let botom = grid[index(this.i, this.j + 1)]
        let left = grid[index(this.i - 1, this.j)]

        if (top && !top.visited) {
            neighbors.push(top)
        }
        if (right && !right.visited) {
            neighbors.push(right)
        }
        if (botom && !botom.visited) {
            neighbors.push(botom)
        }
        if (left && !left.visited) {
            neighbors.push(left)
        }

        if (neighbors.length > 0) {
            let r = floor(random(0, neighbors.length))
            return neighbors[r]
        }
        return undefined
    }

    highlight() {
        let x = this.i * w
        let y = this.j * w
        noStroke()
        fill(0, 0, 255, 100)
        rect(x, y, w, w)
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1
    }
    return i + j * cols
}

function setup() {
    createCanvas(400, 400)
    cols = floor(width / w)
    rows = floor(height / w)

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cell = new Cell(i, j)
            grid.push(cell)
        }
    }

    current = grid[0]

    frameRate(5)
}

function draw() {
    background(51)
    for (let i = 0; i < grid.length; i++) {
        grid[i].show()
    }

    current.visited = true
    current.highlight()
    let next = current.checkNeighbors()
    if (next) {
        next.visited = true
        stack.push(current)
        removeWalls(current, next)
        current = next
    } else if (stack.length > 0) {
        current = stack.pop()
    } else {
        console.log("終了")
        noLoop()
    }
}

function removeWalls(a, b) {
    let x = a.i - b.i
    if (x === 1) {
        // 左に行ったら
        a.walls[3] = false
        b.walls[1] = false
    } else if (x === -1) {
        // 右に行ったら
        a.walls[1] = false
        b.walls[3] = false
    }
    let y = a.j - b.j
    if (y === 1) {
        // 上に行ったら
        a.walls[0] = false
        b.walls[2] = false
    } else if (y === -1) {
        // 下に行ったら
        a.walls[2] = false
        b.walls[0] = false
    }
}