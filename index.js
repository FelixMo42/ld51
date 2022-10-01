const EDIT_MODE = getParameter("edit_mode")
const RADIUS = 60

// create the app, and it too the canvase, but don't make it visible
const game = new PIXI.Application({ resizeTo: window })
document.body.appendChild(game.view)
// game.stage.renderable = false

// start the game
const mouse = MouseHandler()
const camera = CameraHandler()
PlayerHandler()    

function level1() {
    setStage({
        path: rowOfHexs(10),
        players: [
            {
                name: "elephant-1",
                hex: Hex(0, 0)
            }
        ],
        cameraMode: "follow",
    })

    return () => {}
}

function level2() {
    setStage({
        path: [Hex(0, 0),Hex(-1, -1),Hex(0, 1),Hex(-1, 1),Hex(-2, 1),Hex(-3, 2),Hex(1, -2),Hex(0, 2),Hex(1, 2),Hex(-2, -1),Hex(-3, -1),Hex(-4, 0),Hex(-4, 1),Hex(2, -2),Hex(2, -1),Hex(2, 0),Hex(2, 1),Hex(-1, 3),Hex(-2, 3),Hex(-1, -2),Hex(0, -3),Hex(1, -4),Hex(2, -4),Hex(3, -4),Hex(4, -3),Hex(4, -4),Hex(3, -2),Hex(5, -3),Hex(5, -2),Hex(5, -1),Hex(4, 0),Hex(3, 1),Hex(0, -1),Hex(-5, 3),Hex(-6, 3),Hex(-5, 2),Hex(-4, 2),Hex(-5, 4),Hex(-4, 4),Hex(-3, 4)],
        players: [
            {
                name: "elephant-1",
                hex: Hex(0, 0)
            },
            {
                name: "elephant-2",
                hex: Hex(0, 1)
            },
            {
                name: "rover",
                hex: Hex(-6, 3)
            }
        ],
        cameraMode: "static"
    })

    return () => {}
}

function level3() {
    setStage({
        path: [Hex(0, 0),Hex(-1, 1),Hex(1, 0),Hex(-2, 1),Hex(-3, 2),Hex(-4, 3),Hex(-1, 2),Hex(-1, 3),Hex(1, 1),Hex(1, 2),Hex(-2, 0),Hex(-3, 0),Hex(-4, 1),Hex(-5, 2),Hex(-5, 3),Hex(-2, -1),Hex(-1, -2),Hex(0, -2),Hex(1, -3),Hex(2, -3),Hex(2, -2),Hex(2, -1),Hex(-1, 4),Hex(2, 2),Hex(3, 1),Hex(4, 0),Hex(4, -1),Hex(4, -2),Hex(3, -2),Hex(-4, 4),Hex(-3, 4),Hex(-2, 4),Hex(-6, 2),Hex(-7, 3),Hex(-7, 4),Hex(-6, 4),Hex(-6, 5)],
        players: [
            {
                name: "elephant-1",
                hex: Hex(0, 0)
            },
            {
                name: "elephant-2",
                hex: Hex(-4, 3)
            },
        ],
        cameraMode: "follow"
    })

    const fireSprite = new PIXI.Graphics()
    fireSprite.beginFill(0xff0000, 0.5)
    fireSprite.drawRect(
        0,
        -game.stage.y - window.innerHeight / 2 - 300,
        window.innerWidth,
        window.innerHeight
    )
    fireSprite.endFill()
    game.stage.addChild(fireSprite)

    function updateFire() {
        const dt = game.ticker.deltaMS / 1000

        fireSprite.x = -game.stage.x
        fireSprite.y += dt * 50;
    }

    game.ticker.add(updateFire)

    return () => {
        game.ticker.remove(updateFire)
        game.stage.removeChild(fireSprite)
    }
}

function level4() {
    setStage({
        path: [Hex(0, 0),Hex(-1, -1),Hex(0, 1),Hex(-1, 1),Hex(-2, 1),Hex(-3, 2),Hex(1, -2),Hex(0, 2),Hex(1, 2),Hex(-2, -1),Hex(-3, -1),Hex(-4, 0),Hex(-4, 1),Hex(2, -2),Hex(2, -1),Hex(2, 0),Hex(2, 1),Hex(-1, 3),Hex(-2, 3),Hex(-1, -2),Hex(0, -3),Hex(1, -4),Hex(2, -4),Hex(3, -4),Hex(4, -3),Hex(4, -4),Hex(3, -2),Hex(5, -3),Hex(5, -2),Hex(5, -1),Hex(4, 0),Hex(3, 1),Hex(0, -1),Hex(-5, 3),Hex(-6, 3),Hex(-5, 2),Hex(-4, 2),Hex(-5, 4),Hex(-4, 4),Hex(-3, 4)],
        players: [
            {
                name: "elephant-1",
                hex: Hex(0, 0)
            },
            {
                name: "elephant-2",
                hex: Hex(0, 1)
            },
            {
                name: "pelican",
                hex: Hex(-6, 3)
            },
            {
                name: "pelican",
                hex: Hex(3, -4)
            },
            {
                name: "pelican",
                hex: Hex(3, -4)
            },
            {
                name: "pelican",
                hex: Hex(-2, -1)
            }
        ],
        cameraMode: "static"
    })

    return () => {}
}

function level5() {
    setStage({
        path: [Hex(0, 0),Hex(-1, -1),Hex(0, 1),Hex(-1, 1),Hex(-2, 1),Hex(-3, 2),Hex(1, -2),Hex(0, 2),Hex(1, 2),Hex(-2, -1),Hex(-3, -1),Hex(-4, 0),Hex(-4, 1),Hex(2, -2),Hex(2, -1),Hex(2, 0),Hex(2, 1),Hex(-1, 3),Hex(-2, 3),Hex(-1, -2),Hex(0, -3),Hex(1, -4),Hex(2, -4),Hex(3, -4),Hex(4, -3),Hex(4, -4),Hex(3, -2),Hex(5, -3),Hex(5, -2),Hex(5, -1),Hex(4, 0),Hex(3, 1),Hex(0, -1),Hex(-5, 3),Hex(-6, 3),Hex(-5, 2),Hex(-4, 2),Hex(-5, 4),Hex(-4, 4),Hex(-3, 4)],
        players: [
            {
                name: "elephant-1",
                hex: Hex(0, 0)
            },
            {
                name: "elephant-2",
                hex: Hex(0, 1)
            },
            {
                name: "police",
                hex: Hex(-6, 3)
            },
            {
                name: "police",
                hex: Hex(3, -4)
            },
            {
                name: "police",
                hex: Hex(3, -4)
            },
            {
                name: "police",
                hex: Hex(-2, -1)
            }
        ],
        cameraMode: "static"
    })

    return () => {}
}

function level6() {
    let hexs = new Set()
    function getRandomHex() {
        let hex = Hex(
            random(-2, 2),
            random(2, 5),
        )
        if (hexs.has(getHexId(hex))) {
            return getRandomHex()
        } else {
            hexs.add(getHexId(hex))
            return hex
        }
    }

    setStage({
        path: hexCirlce(2, 10),
        players: [
            {
                name: "elephant-1",
                hex: Hex(-1, 1)
            },
            {
                name: "elephant-2",
                hex: Hex(1, 0)
            },
            ...Array(10).fill(0).map((_, i) => ({
                name: `protestor-${i + 1}`,
                hex: getRandomHex()
            }))
        ],
        cameraMode: "follow"
    })

    return () => {}
}

function credits() {
    game.stage.renderable = false
    return () => {}
}

async function run() {
    const levels = [
        level1,
        level2,
        level3,
        level4,
        level5,
        level6,
        credits,
    ]

    if (levels.length === 1) return levels[0]()

    for (const level of levels) {
        const destructor = level()
        await sleep(10)
        destructor()
    }
}

function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

run()

if (false) {
    window.onmousedown = () => {
        updateHexFill(mouse.hex)
        console.log(mouse.hex)
    }
}

function saveHexs() {
    for (const hex of walkableGraphics.keys()) {

    }
}

async function save() {
    navigator.clipboard.writeText(JSON.stringify(getAllWalkableHexs()))
}