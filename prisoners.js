/*
https://www.youtube.com/watch?v=IPNtwhR5ySI

利得表

                  相手
    |       | 協調 | 裏切り
自分| 協調  |   1  |   0
    | 裏切り|  	b  |   0

    b > 1

*/
const btn = document.getElementById("btn")
const uscore = document.getElementById("uscore")
const canvasW = 1000
const canvasH = 500
// セルの正方形一辺
const cellSize = 10
// 行列の数
const cols = Math.floor(canvasW / cellSize)
const rows = Math.floor(canvasH / cellSize)
// セルの配列
let cellArr = []
// 裏切りの得点(1より大きく)
let b
// 周囲をチェックする時の配列
const checkAroundArr = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
]

class Cell {
    constructor(strategy = "", score = 0) {
        if (!strategy) {
            this.strategy = random(["協力", "裏切り"])
        } else {
            this.strategy = strategy
        }
        this.score = score
    }
}

// 最初の配列作成
function makeArr() {
    for (let y = 0; y < rows; y++) {
        let tmp = []
        for (let x = 0; x < cols; x++) {
            tmp.push(new Cell())
        }
        cellArr.push(tmp)
    }
}

// 周囲を見て自分のスコアを更新
function updateScore() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            cellArr[y][x].score = checkAround1(y, x)
        }
    }
}

// 周りをチェックしてスコアを返す
function checkAround1(y, x) {
    let score = 0
    // 自分の戦略
    const selfStrategy = cellArr[y][x].strategy

    for (const v of checkAroundArr) {
        const row = y + v[0]
        const col = x + v[1]
        // 相手の戦略※周期境界条件で見る
        const otherStrategy = cellArr[(row + rows) % rows][(col + cols) % cols].strategy
        // 得点計算
        if (selfStrategy === "協力") {
            if (otherStrategy === "協力") {
                score += 1
            } else {
                score += 0
            }

        } else {
            if (otherStrategy === "協力") {
                score += b
            } else {
                score += 0
            }
        }
    }
    return score
}

// 周囲を見て一番スコアの高い戦略に更新
function updateStrategy() {
    let tmp = []
    for (let y = 0; y < rows; y++) {
        let tmp2 = []
        for (let x = 0; x < cols; x++) {
            tmp2.push(new Cell(strategy = checkAround2(y, x)))
        }
        tmp.push(tmp2)
    }
    cellArr = tmp
}

// 周りをチェックしてスコアが高い戦略を返す
function checkAround2(y, x) {
    // 最大のスコア 暫定で自分の得点
    let maxScore = cellArr[y][x].score
    // 最高の戦略　暫定で自分の戦略
    let maxStrategy = cellArr[y][x].strategy

    for (const v of checkAroundArr) {
        const row = y + v[0]
        const col = x + v[1]
        // 相手の得点※周期境界条件で見る
        const otherScore = cellArr[(row + rows) % rows][(col + cols) % cols].score
        if (maxScore < otherScore) {
            maxScore = otherScore
            maxStrategy = cellArr[(row + rows) % rows][(col + cols) % cols].strategy
        }
    }
    return maxStrategy
}

function show() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (cellArr[y][x].strategy === "協力") {
                fill("green")
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            } else {
                fill("red")
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    }
}

function reset() {
    cellArr = []
    makeArr()
}

function setup() {
    createCanvas(canvasW, canvasH)
    background(51)
    frameRate(5)
    reset()
}

function draw() {
    if (b) {
        show()
        updateScore()
        updateStrategy()
    }
}

btn.addEventListener("click", () => {
    b = Number(uscore.value)
    clear()
    reset()
})