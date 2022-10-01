const walkable = new Set()

function Hex(q, r) {
    return { q, r }
}

function rowOfHexs(num) {
    let hexs = []

    for (let i = 0; i < num; i++) {
        hexs.push(Hex(0, i))
    }

    return hexs
}

function hexToPixel({ q, r }) {
    return {
        x: RADIUS * (           3/2 * q                     ),
        y: RADIUS * (Math.sqrt(3)/2 * q  +  Math.sqrt(3) * r),
    }
}

function pixelToHex({ x, y }) {
    let q = ( 2/3 * x                     ) / RADIUS
    let r = (-1/3 * x + Math.sqrt(3)/3 * y) / RADIUS

    if (Math.abs(q - Math.round(q)) < 0.0001) {
        q = Math.round(q)
    }

    if (Math.abs(r - Math.round(r)) < 0.0001) {
        r = Math.round(r)
    }

    return Hex(q, r)
}

function nearestHex({ q, r }) {
    const s = -q-r

    let rq = Math.round(q)
    let rr = Math.round(r)
    let rs = Math.round(s)

    const dq = Math.abs(rq - q)
    const dr = Math.abs(rr - r)
    const ds = Math.abs(rs - s)

    if (dq > dr && dq > ds) {
        rq = -rr-rs
    } else if (dr > ds) {
        rr = -rq-rs
    }

    return { q: rq, r: rr }
}

function addHexs(a, b) {
    return Hex(a.q + b.q, a.r + b.r)
}

function subHexs(a, b) {
    return Hex(a.q - b.q, a.r - b.r)
}

function getHexDistance(a, b) {
    let { q, r } = subHexs(a, b)
    let s = -q-r

    return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2
}

function* getHexNeighbors(hex) {
    if ((Math.floor(hex.q) !== hex.q) || (Math.floor(hex.r) !== hex.r)) {
        let nearest = nearestHex(hex)
        let direction = Hex(Math.sign(hex.q - nearest.q), Math.sign(hex.r - nearest.r))
        
        let a = getHexNeighbors(nearest)
        let b = [...getHexNeighbors(addHexs(nearest, direction))]

        yield nearest
        yield addHexs(nearest, direction)

        for (let hex of a) {
            if (b.find((v) => equals(v, hex))) {
                yield hex
            }
        }

        return;
    }

    var directions = [
        Hex(+1, 0), Hex(+1, -1), Hex(0, -1), 
        Hex(-1, 0), Hex(-1, +1), Hex(0, +1), 
    ]

    for (const direction of directions) {
        yield addHexs(hex, direction)
    }
}

function getHexPoints(hex=Hex(0, 0)) {
    let { x, y } = hexToPixel(hex)

    let points = []
    for (let i = 0; i < 6; i++) {
        points.push(Math.floor(RADIUS * Math.cos((Math.PI * 60 / 360) * (2 * i)) + x))
        points.push(Math.floor(RADIUS * Math.sin((Math.PI * 60 / 360) * (2 * i)) + y))
    }
    return points
}

function equals(a, b) {
    return a.q === b.q && a.r === b.r
}

function getHexId(hex) {
    return `${hex.q},${hex.r}`
}

function setWalkable(hex) {
    if (walkable.has(getHexId(hex))) {
        walkable.delete(getHexId(hex))
        return false
    } else {
        walkable.add(getHexId(hex))
        return true
    }
}

function isWalkable(hex) {
    return walkable.has(getHexId(hex))
}

function getAllWalkableHexs() {
    const hexs = []
    for (let id of walkable.values()) {
        let [ q, r ] = id.split(",")
        hexs.push( Hex(Number.parseInt(q), Number.parseInt(r)) )
    }
    return hexs
}

function pathfind(a, b) {
    if (!isWalkable(b) || equals(a, b)) return []

    const open = new Heap()
    const seen = new Map()

    queue(a)

    while (true) {
        const current = open.pop()

        if (!current || equals(current, b)) break

        for (const neighbor of getHexNeighbors(current)) {
            if (!isWalkable(neighbor)) continue

            const info = seen.get(getHexId(neighbor))

            if (!info) {
                queue(neighbor, current)
            } else if (info.cost > current.cost + 1) {
                // TODO!
            }
        }
    }

    // Retrive the path
    let current = seen.get(getHexId(b))
    let path = []
    while (current) {
        path.push({ q: current.q, r: current.r })
        current = current.prev
    }
    return path

    function queue(neighbor, current) {
        const info = {
            cost: current !== undefined ? (current.cost + 1) : 1,
            prev: current,
            q: neighbor.q,
            r: neighbor.r,
        }

        seen.set(getHexId(neighbor), info)
        open.push(info) 
    }
}

function doesHexHavePlayer(hex) {
    for (const player of players) {
        if (equals(nearestHex(player.hex), hex)) {
            return true
        }
    }
    return false
}

function hexCirlce(width, height) {
    const hexs = []
    for (let q = -width; q <= width; q++) {
        for (let r = Math.max(-height, -q-height); r <= Math.min(height, -q+height); r++) {
            hexs.push(Hex(q, r))
        }
    }
    return hexs
}

function doesHexHaveNpc(hex) {
    for (const npc of npcs) {
        if (equals(nearestHex(npc.hex), hex)) {
            return true
        }
    }

    return false
}

function pathfind2(a, b) {
    if (!isWalkable(b) || equals(a, b)) return []

    const open = new Heap()
    const seen = new Map()

    queue(a)

    while (true) {
        const current = open.pop()

        if (!current || equals(current, b)) break

        for (const neighbor of getHexNeighbors(current)) {
            if (!isWalkable(neighbor) || doesHexHavePlayer(neighbor)) continue

            const info = seen.get(getHexId(neighbor))

            if (!info) {
                queue(neighbor, current)
            } else if (info.prev && current.cost < info.prev.cost) {
                // info.prev = current
            }
        }
    }

    // Retrive the path
    let current = seen.get(getHexId(b))
    let path = []
    while (current) {
        path.push({ q: current.q, r: current.r })
        current = current.prev
    }
    return path

    function queue(neighbor, current) {
        let d = -getHexDistanceFromPlayers(neighbor)
        const info = {
            cost: d, //current !== undefined ? (current.cost + d) : d,
            prev: current,
            q: neighbor.q,
            r: neighbor.r,
        }

        seen.set(getHexId(neighbor), info)
        open.push(info) 
    }
}

function pathfind3(a, b) {
    if (!isWalkable(b) || equals(a, b)) return []

    const open = new Heap()
    const seen = new Map()

    queue(a)

    while (true) {
        const current = open.pop()

        if (!current || equals(current, b)) break

        for (const neighbor of getHexNeighbors(current)) {
            if (!isWalkable(neighbor) || doesHexHaveNpc(neighbor)) continue

            const info = seen.get(getHexId(neighbor))

            if (!info) {
                queue(neighbor, current)
            } else if (info.cost > current.cost + 1) {
                // TODO!
            }
        }
    }

    // Retrive the path
    let current = seen.get(getHexId(b))
    let path = []
    while (current) {
        path.push({ q: current.q, r: current.r })
        current = current.prev
    }
    return path

    function queue(neighbor, current) {
        const info = {
            cost: current !== undefined ? (current.cost + 1) : 1,
            prev: current,
            q: neighbor.q,
            r: neighbor.r,
        }

        seen.set(getHexId(neighbor), info)
        open.push(info) 
    }
}
