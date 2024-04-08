/*
    Calculations
    Tageting Behaviors
    - 
    Creatures
    Actions
*/

const point = (v, dv, speed) => v + dv * speed

const dir = ({ x, y }, { x: px, y: py }) => {
    let dx = px - x
    let dy = py - y
    if (dx !== 0) dx = dx / Math.abs(dx)
    if (dy !== 0) dy = dy / Math.abs(dy)
    return { dx, dy }
}

const rev = (origin, pos) => {
    const { dx, dy } = dir(origin, pos)
    return { dx: -dx, dy: -dy }
}

// params: origin, pos
const dist = ({ x, y }, { x: px, y: py }) => Math.sqrt(
    (px - x) ** 2
    + (py - y) ** 2
)

const in_bounds = ({ x, y }, { width, height }) => x < width && x > 0 && y < height && y > 0

const cross_bound = (v, bound) => v > bound ? 1
: v < 0 ? -1
: 0

// adjacent based on eight directions
// adj(N) => [NE, NW]
const adj = ({ dx, dy }) => {
    if (dx === 0) return [{ dx: -1, dy }, { dx: 1, dy }]
    if (dy === 0) return [{ dx, dy: -1 }, { dx, dy: 1 }]
    return [{ dx, dy: 0 }, { dx: 0, dy }]
}

// tangent based on perpendiculars:
// tan(N) => [E, W]
// tan(NE) => [S, W]
// Use for intersection with boundaries, intersection = { dx, dy }
const tan = ({ dx, dy }) => {
    if (dx === 0) return [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }]
    if (dy === 0) return [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
    return [{ dx: -dx, dy: 0 }, { dx: 0, dy: -dy }]
}

// Targeting Behaviors

const target_ahead = function({ player, dims, creature }) {
    const { x, y, speed } = creature
    const { dx, dy } = dir(player, creature)
    const s = { x: point(x, dx, speed),  y: point(y, dy, speed) }
    if (in_bounds(s, dims)) 
        return s

    const intersect = { dx: cross_bound(s.x, dims.width), dy: cross_bound(s.y, dims.height) }
    let [ a, b ] = tan(intersect)
    a = { x: point(x, a.dx, speed), y: point(y, a.dy, speed) }
    b = { x: point(x, b.dx, speed), y: point(y, b.dy, speed) }

    if (dist(player, a) > dist(player, b)) 
        return a
    return b
}

const target_step = ({ player, dims, creature }) => {
    const { x: px, y: py, speed: ps } = player
    const { x, y, speed } = creature


    const { dx, dy } = dir(player, creature)
    const [ a, b ] = dx === 0 || dy === 0
        ? tan({ dx, dy })
        : adj({ dx, dy })
    a.x = player.x + a.dx * player.speed 
    a.y = player.y + a.dy * player.speed
    b.x = player.x + b.dx * player.speed
    b.y = player.y + b.dy * player.speed



    const da = dir(creature, a)
    const c_a = { 
        x: creature.x + da.dx * creature.speed,
        y: creature.y + da.dy * creature.speed
    }
    const db = dir(creature, b)
    const c_b = {
        x: creature.x + db.dx * creature.speed,
        y: creature.y + db.dy * creature.speed
    }
    console.log(c_a, c_b)
    if (dist(player, c_a) > dist(player, c_b))
        return c_a
    else return c_b
}

const target_offset = ({ player, dims, creature }) => {}

const target_corner = ({ player, dims, creature }) => {}

const target_curve = ({ player, dims, creature }) => {}

const targeting = {
    ahead: target_ahead,
    step: target_step,
    offset: target_offset,
    corner: target_corner,
    curve: target_curve
}

const is_movable = (player, creature) => {
    const { x, y } = player
    const { last_position, proximity } = creature
    if ((last_position.x === x && last_position.y === y)
    && dist(player, creature) > proximity) 
        return false;
    creature.last_position = { x, y }
    return true
}

export const update_position = ({ player, dims, creature }) => {
    if (!targeting.hasOwnProperty(creature.target)) return false;
    if (!is_movable(player, creature)) return false;
    const pos = targeting[creature.target]({ player, dims, creature })
    move(creature, pos)
}

// Creatures

const red_creature = (creature) => ({
    ...creature,
    size: 10, 
    speed: 5, 
    color: [255, 0, 0], 
    proximity: 50,
    target: 'ahead'
})

const pink_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [188, 143, 143],
    proximity: 100,
    target: 'step'
})

const blue_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [0, 255, 0],
    proximity: 50,
    target: 'offset'
})

const orange_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [255, 127, 0],
    proximity: 50,
    target: 'corner'
})

const types = {
    red: red_creature,
    pink: pink_creature,
    blue: blue_creature,
    orange: orange_creature
}

export const createCreature = ({ dims, player, type, position }) => {
    if (!types.hasOwnProperty(type)) return false;
    if (position === undefined)
        position = { 
            x: Math.random() * dims.width,
            y: Math.random() * dims.height
        }
    const creature = {
        ...position,
        last_position: { x: player.x, y: player.y }
    }
    return types[type](creature)
}

export const move = (creature, { x, y }) => {
    creature.x = x
    creature.y = y
}

export const render = ({ x, y, size, color }, p) => {
    p.fill(...color)
    p.noStroke()
    p.circle(x, y, size)
}