// セル正方形のサイズ
const cellSize = 20
let cols
let rows
let arr
let randStart = false
let arrangement = false

function setup() {
    // 画面横のセル数
    cols = floor(windowWidth / cellSize)
    // 画面縦のセル数
    rows = floor(windowHeight / cellSize)

    createCanvas(cols * cellSize, rows * cellSize)

    // 配置時の削除で右クリックを使うので
    document.querySelector("canvas").addEventListener("contextmenu", (e) => {
        e.preventDefault()
    })

    background("#ccc")

    const btn1 = createButton("　　ランダム　　")
    btn1.position(30, 30)
    btn1.mousePressed(() => {
        arr = makeArr2()
        randStart = true
    })

    const btn2 = createButton("　　　配置　　　")
    btn2.position(30, 60)
    btn2.mousePressed(() => {
        randStart = false
        arr = makeArr1()
        arrangement = true
    })

    const btn3 = createButton("　配置スタート　")
    btn3.position(30, 90)
    btn3.mousePressed(() => {
        if (!arr) {
            arr = makeArr2()
        }
        arrangement = false
        randStart = true
    })

    frameRate(20)
}

function draw() {
    if (randStart) {
        show()
        next()
    }

    if (arrangement) {
        show()
        if (mouseIsPressed) {
            if (mouseButton === LEFT) {
                arr[floor(mouseY / cellSize)][floor(mouseX / cellSize)] = 1
            } else if (mouseButton === RIGHT) {
                arr[floor(mouseY / cellSize)][floor(mouseX / cellSize)] = 0
            }
        }
    }
}

function makeArr1() {
    const arr = []
    // 全部0で初期化
    for (let y = 0; y < rows; y++) {
        const row = []
        for (let x = 0; x < cols; x++) {
            row.push(0)
        }
        arr.push(row)
    }
    return arr
}

function makeArr2() {
    const arr = []
    for (let y = 0; y < rows; y++) {
        const row = []
        for (let x = 0; x < cols; x++) {
            row.push(int(random(0, 2)))
        }
        arr.push(row)
    }
    return arr
}

function show() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (arr[y][x] === 0) {
                fill("white")
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            } else {
                fill("black")
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    }
}

function next() {
    const tmp = []
    for (let y = 0; y < rows; y++) {
        const row = []
        for (let x = 0; x < cols; x++) {
            let count = check(y, x)
            if (count === 3) {
                // 誕生
                row.push(1)
            } else if (count === 2) {
                // 存続
                row.push(arr[y][x])
            } else {
                // 死滅
                row.push(0)
            }
        }
        tmp.push(row)
    }
    arr = tmp
}

/*
3つは誕生
2つは存続
それ以外は死
*/

function check(y, x) {
    let count = 0
    const tmp = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
    ]

    for (const v of tmp) {
        const row = y + v[0]
        const col = x + v[1]
        // 周期境界条件
        count += arr[(row + rows) % rows][(col + cols) % cols]
    }

    return count
}
