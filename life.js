// セル正方形のサイズ
const cellSize = 20
let screenW
let screenH
let arr
let randStart = false
let arrangement = false

function setup() {
    // 画面横のセル数
    screenW = Math.floor(windowWidth / cellSize)
    // 画面縦のセル数
    screenH = Math.floor(windowHeight / cellSize)

    createCanvas(screenW * cellSize, screenH * cellSize)

    // 配置時の削除で右クリックを使うので
    document.querySelector("#defaultCanvas0").addEventListener("contextmenu", (e) => {
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

function doubleClicked() {
    state = !state
}

function makeArr1() {
    const arr = []
    // 全部0で初期化
    for (let y = 0; y < screenH; y++) {
        const row = []
        for (let x = 0; x < screenW; x++) {
            row.push(0)
        }
        arr.push(row)
    }
    return arr
}

function makeArr2() {
    const arr = []
    for (let y = 0; y < screenH; y++) {
        const row = []
        for (let x = 0; x < screenW; x++) {
            row.push(int(random(0, 2)))
        }
        arr.push(row)
    }
    return arr
}

function show() {
    for (let y = 0; y < screenH; y++) {
        for (let x = 0; x < screenW; x++) {
            if (arr[y][x] === 0) {
                fill("white")
                // noStroke()
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            } else {
                fill("black")
                // noStroke()
                rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    }
}

function next() {
    const tmp = []
    for (let y = 0; y < screenH; y++) {
        const row = []
        for (let x = 0; x < screenW; x++) {
            let count
            if (arr[y][x] === 0) {
                count = check(y, x)
                if (count === 3) {
                    row.push(1)
                } else {
                    row.push(0)
                }
            } else {
                count = check(y, x)
                if (count === 2 || count === 3) {
                    row.push(1)
                } else if (count <= 1) {
                    row.push(0)
                } else {
                    row.push(0)
                }
            }
        }
        tmp.push(row)
    }
    arr = tmp
}

/*
誕生
    死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
生存
    生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
過疎
    生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
過密
    生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。
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
        if (row < 0 || col < 0 || row >= screenH || col >= screenW) {
            continue
        }
        if (arr[row][col] === 1) {
            count++
        }
    }

    return count
}
