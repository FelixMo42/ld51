const EDIT_MODE = getParameter("edit_mode")
const LEVEL_ID = getParameter("level") || 0

function createMouseHandler() {
    const mouse = {
        currentHex: Hex(0, 0),
        position: { x: 0, y: 0 } 
    }

    // Create the sprite to show what hex the mouse is over
    let graphics = new PIXI.Graphics()
    graphics.beginFill(0xaaaaaa)
    graphics.drawCircle(0, 0, 10)
    game.stage.addChild(graphics)

    let path = new PIXI.Graphics()
    game.stage.addChild(path)

    window.onmousemove = (e) => {
        mouse.position = {
            x: e.pageX,
            y: e.pageY,
        }
    }

    window.onmousedown = (e) => {
        if (!e.shiftKey) {
            player.hex = pixelToHex(player.sprite)
            player.path = pathfind(player.hex, mouse.hex).slice(0, -1)
            if (player.path.length > 0) {
                player.distance = getHexDistance(player.hex, player.path[player.path.length - 1])
                player.travled = 0
            }
            rotatePlayers()
        }

        if (e.shiftKey && EDIT_MODE) {
            updateHexFill(mouse.hex)
        }
    }

    game.ticker.add(() => {
        // Update the mouse hex
        mouse.hex = nearestHex(pixelToHex({
            x: mouse.position.x - game.stage.x,
            y: mouse.position.y - game.stage.y,
        }))

        // Move the mouse sprite
        const {x, y} = hexToPixel(mouse.hex)
        graphics.x = x
        graphics.y = y

        // Redraw the path
        path.clear()
        path.lineStyle(5, 0xffffff, 0.5)
        path.moveTo(x, y)
        for (const node of pathfind(pixelToHex(player.sprite), mouse.hex)) {
            let { x, y } = hexToPixel(node)
            path.lineTo(x, y)
        }
    })

    return mouse
}

function Player(startHex) {
    //
    let sprite = new PIXI.Graphics()
    sprite.beginFill(0xffffff)
    sprite.drawCircle(0, 0, RADIUS / 2)
    let { x, y } = hexToPixel(startHex)
    sprite.x = x
    sprite.y = y
    game.stage.addChild(sprite)
    
    return {
        sprite,
        hex: startHex,
        path: [],
        
        // used for smooth player movment
        distance: 0,
        travled: 0
    }
}

// Create the canvas and runtime, and add it to the document.
const game = new PIXI.Application({ resizeTo: window })
document.body.appendChild(game.view)

// Draw hexs over filled in hexs
const filledHexs = new Map()
function updateHexFill(hex) {
    if (setWalkable(hex)) {
        const g = new PIXI.Graphics()
        g.beginFill(0xffffff, 0.2)
        g.drawPolygon(getHexPoints(hex))
        g.endFill()
        game.stage.addChild(g)
        filledHexs.set(getHexId(hex), g)
    } else {
        game.stage.removeChild(filledHexs.get(getHexId(hex)))
        filledHexs.delete(getHexId(hex))
    }
}

function rotatePlayers() {
    selectPlayer((selectedPlayer + 1) % players.length)
}

function selectPlayer(id) {
    if (player) {
        player.sprite.tint = 0xffffff 
    }

    selectedPlayer = id
    player = players[selectedPlayer]

    player.sprite.tint = 0x4682b4
}

// list of all players in the scene
const players = []

async function init() {
    // retrive level data
    const level = await fetch(`./lvl/${LEVEL_ID}.json`).then(res => res.json())

    // add walkable paths
    for (const hex of level.path) {
        updateHexFill(hex)
    }

    // add players
    for (const player of level.players) {
        players.push(Player(player.hex))
    }
    
    // select the first one
    selectPlayer(0)

    // start the game
    start()
}

function save() {
    navigator.clipboard.writeText(JSON.stringify({
        path: getAllWalkableHexs(),
        players: players.map((player) => ({
            hex: player.hex
        })),
    }))
}

function start() {
    // Create the hex that follows the mouse around
    createMouseHandler()
    
    game.ticker.add(() => {
        const dt = game.ticker.deltaMS / 1000

        for (const player of players) {
            if (player.path.length > 0) {
                // incrament the distance travled counter
                player.travled += dt

                if (player.travled >= player.distance) {
                    // 
                    player.hex = player.path.pop()

                    // reset the player position to the hex to stop drift
                    let { x, y } = hexToPixel(player.hex)
                    player.sprite.x = x
                    player.sprite.y = y

                    // reset the counters
                    player.distance = 1
                    player.travled = 0
                } else {
                    // move it move it
                    let a = hexToPixel(player.hex)
                    let b = hexToPixel(player.path[player.path.length - 1])
                    let percent = player.travled / player.distance
                    player.sprite.x = interpolate(percent, a.x, b.x)
                    player.sprite.y = interpolate(percent, a.y, b.y)
                }
            }
        }

        game.stage.x = -player.sprite.x + window.innerWidth / 2
        game.stage.y = -player.sprite.y + window.innerHeight / 2
    })
}

init()

// Selected player
let selectedPlayer = -1;
let player = null

if (EDIT_MODE) {
    document.onkeyup = (e) => {
        if (e.key === "s") {
            save()
        }
    }
}