// キャンバスの一辺（正方形）
const hen = 600
// セル正方形のサイズ
const cellSize = 20
// 画面縦のセル数
const screenH = hen / cellSize
// 画面横のセル数
const screenW = hen / cellSize
// 蛇配列
let snakeArr
// 方向
let direction
// 餌座標
let food
// ゲーム状況
let state
// スコア
let score
// ハイスコア
let highScore

function randomFood() {
    const x = Math.floor(Math.random() * screenW)
    const y = Math.floor(Math.random() * screenH)
    food.x = x
    food.y = y
}

function setup() {
    const canvas = createCanvas(hen, hen)
    canvas.parent("hoge")
    frameRate(10)
    direction = ""
    snakeArr = []
    food = {}
    score = 0
    highScore = 0
    randomFood()
    snakeArr.push(createVector(0, 0))
    state = "start"
}

function draw() {
    let newHead
    if (direction === "up") {
        newHead = createVector(snakeArr[0].x, snakeArr[0].y - 1)
    } else if (direction === "right") {
        newHead = createVector(snakeArr[0].x + 1, snakeArr[0].y)
    } else if (direction === "down") {
        newHead = createVector(snakeArr[0].x, snakeArr[0].y + 1)
    } else if (direction === "left") {
        newHead = createVector(snakeArr[0].x - 1, snakeArr[0].y)
    } else {
        newHead = createVector(snakeArr[0].x, snakeArr[0].y)
    }

    // 自分に当たる
    if (snakeArr.length > 1) {
        for (const v of snakeArr) {
            if (v.x === newHead.x && v.y === newHead.y) {
                state = "over"
            }
        }
    }

    // 餌を食べる他
    if (food.x === newHead.x && food.y === newHead.y) {
        // 配列の先頭に挿入
        snakeArr.unshift(newHead)
        randomFood()
        score++
    } else if (newHead.x >= 0 && newHead.y >= 0 && newHead.x < screenW && newHead.y < screenH) {
        // 配列の先頭に挿入
        snakeArr.unshift(newHead)
        // 配列の最後を削除
        snakeArr.pop()
    } else {
        state = "over"
    }

    show()

    if (state == "start") {
        gameStart()
    }

    if (state == "over") {
        gameOver()
    }
}

function keyPressed() {
    if (state == "start") {
        state = "play"
        loop()
    }

    if (state == "over") {
        state = "start"
        direction = ""
        snakeArr = []
        food = {}
        if (score > highScore) {
            highScore = score
        }
        score = 0
        randomFood()
        snakeArr.push(createVector(0, 0))
        loop()
    }

    if (state == "play") {
        switch (keyCode) {
            case UP_ARROW:
                if (direction != "down") {
                    direction = "up"
                }
                break
            case DOWN_ARROW:
                if (direction != "up") {
                    direction = "down"
                }
                break
            case RIGHT_ARROW:
                if (direction != "left") {
                    direction = "right"
                }
                break
            case LEFT_ARROW:
                if (direction != "right") {
                    direction = "left"
                }
                break
        }
    }
}

function gameOver() {
    noLoop()
    textSize(50)
    fill("white")
    textAlign(CENTER)
    text("ゲーム・オーバー", width / 2, height / 2)
}

function gameStart() {
    noLoop()
    textSize(50)
    fill("white")
    textAlign(CENTER)
    text("スネーク・ゲーム", width / 2, height / 2)
}

function show() {
    background(51)
    textSize(16)
    textAlign(LEFT)
    fill("white")
    text(`score:${score}, highScore:${highScore}`, 25, 16)

    for (let y = 0; y < screenH; y++) {
        for (let x = 0; x < screenW; x++) {

            if (food.y === y && food.x === x) {
                fill("red")
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }

            if (snakeArr[0].y === y && snakeArr[0].x === x) {
                for (const v of snakeArr) {
                    fill("green")
                    rect(v.x * cellSize, v.y * cellSize, cellSize, cellSize)
                }
            }
        }
    }
}