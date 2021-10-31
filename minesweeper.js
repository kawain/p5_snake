const b1 = document.getElementById("b1")
const b2 = document.getElementById("b2")
const b3 = document.getElementById("b3")
// セル正方形のサイズ
const cellSize = 30
// ゲーム状態
let state = ""
// マスに入るオブジェクト
class Grid {
    constructor() {
        this.bomb = false
        this.count = 0
        this.open = false
        this.flag = false
    }
}
// マスの配列
let grids = []
// マスの縦横と爆弾数
let h, w, bomb

function setup() {
    const canvas = createCanvas(0, 0)
    canvas.parent("canvas_div")
    // 左クリック
    document.querySelector("canvas").addEventListener("click", (e) => {
        click1()
    })
    // 右クリック
    document.querySelector("canvas").addEventListener("contextmenu", (e) => {
        e.preventDefault()
        click2()
    })
    frameRate(20)
}

function draw() {
    background(255)


    if (state === "start") {
        for (let y = 0; y < grids.length; y++) {
            for (let x = 0; x < grids[y].length; x++) {
                noFill()
                rect(x * cellSize, y * cellSize, cellSize, cellSize)

                if (grids[y][x].flag) {
                    fill("blue")
                    rect(x * cellSize, y * cellSize, cellSize, cellSize)
                } else if (grids[y][x].open) {
                    if (grids[y][x].count > 0) {
                        fill("black")
                        textSize(30)
                        // 文字位置の調整
                        text(grids[y][x].count, x * cellSize + 5, y * cellSize + cellSize - 3)
                    }
                } else {
                    fill("gray")
                    rect(x * cellSize, y * cellSize, cellSize, cellSize)
                }
            }
        }
    }

    if (state === "over") {
        for (let y = 0; y < grids.length; y++) {
            for (let x = 0; x < grids[y].length; x++) {
                noFill()
                rect(x * cellSize, y * cellSize, cellSize, cellSize)

                if (grids[y][x].bomb === true) {
                    fill("red")
                    // 円小さめの調整
                    let circleSize = cellSize - 10
                    circle(x * cellSize + (circleSize / 2) + 5, y * cellSize + (circleSize / 2) + 5, circleSize)
                }

                if (grids[y][x].count > 0) {
                    fill(0)
                    textSize(30)
                    // 文字位置の調整
                    text(grids[y][x].count, x * cellSize + 5, y * cellSize + cellSize - 3)
                }
            }
        }
        noLoop()
    }
}

function click1() {
    if (state === "start") {
        const y = floor(mouseY / cellSize)
        const x = floor(mouseX / cellSize)
        if (!grids[y][x].flag) {
            if (grids[y][x].bomb) {
                state = "over"
                alert("あなたの負けです")
            } else {
                grids[y][x].open = true
                searchRecursion(y, x)
                chackClear()
            }
        }
    }
}

function click2() {
    if (state === "start") {
        const y = floor(mouseY / cellSize)
        const x = floor(mouseX / cellSize)
        grids[y][x].flag = !grids[y][x].flag
    }
}

function chackClear() {
    let i = 0
    for (const v of grids) {
        for (const obj of v) {
            if (obj.open) {
                i++
            }
        }
    }
    if ((h * w - bomb) === i) {
        state = "over"
        alert("あなたの勝ちです")
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let r = Math.floor(Math.random() * (i + 1))
        let tmp = array[i]
        array[i] = array[r]
        array[r] = tmp
    }
    return array
}

function makeArr(row, col, bombNum) {
    all = row * col
    let tmp = []
    for (let i = 0; i < all; i++) {
        const obj = new Grid()
        if (i < bombNum) {
            obj.bomb = true
            tmp.push(obj)
        } else {
            tmp.push(obj)
        }
    }

    shuffleTmp = shuffleArray(tmp)

    tmp = []
    let i = 0
    for (let y = 0; y < row; y++) {
        const tmp2 = []
        for (let x = 0; x < col; x++) {
            tmp2.push(shuffleTmp[i])
            i++
        }
        tmp.push(tmp2)
    }

    return tmp
}

function lookAround(y, x) {
    let count = 0

    const surroundArray = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
    ]

    for (const v of surroundArray) {
        const row = y + v[0]
        const col = x + v[1]
        if (row >= 0 && col >= 0 && row < h && col < w) {
            if (grids[row][col].bomb) {
                count++
            }
        }
    }

    return count
}

function searchRecursion(y, x) {
    // 爆弾は終了
    if (grids[y][x].bomb) {
        return
    }

    // 1以上なら開けて終了
    if (grids[y][x].count > 0) {
        grids[y][x].open = true
        return
    }

    const surroundArray = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ]

    for (const v of surroundArray) {
        const row = y + v[0]
        const col = x + v[1]
        if (row >= 0 && col >= 0 && row < h && col < w) {
            // 訪問済みでない
            if (!grids[row][col].open) {
                grids[row][col].open = true
                // 再帰する
                searchRecursion(row, col)
            }
        }
    }
}

function levelChoice(n) {
    const level = {
        // 縦9×横9のマスに10個の地雷
        1: [9, 9, 10],
        // 縦16×横16のマスに40個の地雷
        2: [16, 16, 40],
        // 縦16×横30のマスに99個の地雷
        3: [16, 30, 99],
    }
    const [r, c, b] = level[n]
    h = r
    w = c
    bomb = b
    grids = makeArr(r, c, b)
    // resizeCanvas(windowWidth, windowHeight)
    resizeCanvas(c * cellSize, r * cellSize)

    // 周辺調査
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) {
            if (!grids[y][x].bomb) {
                grids[y][x].count = lookAround(y, x)
            }
        }
    }

    state = "start"
    loop()
}

b1.addEventListener("click", () => {
    levelChoice(1)
})

b2.addEventListener("click", () => {
    levelChoice(2)
})

b3.addEventListener("click", () => {
    levelChoice(3)
})
