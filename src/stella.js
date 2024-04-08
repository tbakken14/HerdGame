import { dir, dist, adj, tan, in_bounds, cross_bound, point } from "./calc"

export const move = (creature, { x, y }) => {
    creature.x = x
    creature.y = y
}

export const render = ({ x, y, size, color }, p) => {
    p.fill(...color)
    p.noStroke()
    p.circle(x, y, size)
}

// Targeting Behaviors

const is_movable = (player, creature) => {
    const { x, y } = player
    const { last_position, proximity } = creature
    if ((last_position.x === x && last_position.y === y)
    && dist(player, creature) > proximity) return false;

    creature.last_position = { x, y }
    return true
}

const target_ahead = function({ player, dims, creature }) {
    const { x, y, speed } = creature
    if (!is_movable(player, creature))
        return { x: player.x, y: player.y }

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
    const { x, y, speed } = creature
    if (!is_movable(player, creature)) 
        return;
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
    if (dist(player, c_a) > dist(player, c_b))
        creature.move(c_a)
    else creature.move(c_b)
}

const target_offset = (player, creature, { width, height }) => {}

const target_corner = (player, creature, { width, height }) => {}

const target_curve = (player, creature, { width, height }) => {}

const targeting = {
    ahead: target_ahead,
    step: target_step,
    offset: target_offset,
    corner: target_corner,
    curve: target_curve
}

export const update_position = (player, dims, creature) => {
    const { target, ...props } = creature
    if (!targeting.hasOwnProperty(target)) return false;

    const params = { player, dims, creature: props }
    const pos = targeting[target](params)
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
    const { x, y } = player
    if (position === undefined)
        position = { 
            x: Math.random() * dims.width,
            y: Math.random() * dims.height
        }
    const creature = {
        ...position,
        last_position: { x, y }
    }
    return types[type](creature)
}