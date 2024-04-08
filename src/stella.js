import { dir, dist, adj, tan } from "./calc"

const is_movable = (player, creature) => (
    creature.last_position.x !== player.x
    || creature.last_position.y !== player.y
) && dist(player, creature) <= creature.proximity

const target_ahead = (player, creature, { width, height }) => {
    const { dx, dy } = dir(player, creature)
    const [ sx, sy ] = [
        creature.x + dx * creature.speed,
        creature.y + dy * creature.speed
    ]
    if (sx < width && sx > 0 && sy < height && sy > 0) {
        creature.move({ x: sx, y: sy })
        return;
    }

    const intersect = {
        dx: sx > width ? 1 : sx < 0 ? -1 : 0,
        dy: sy > height ? 1 : sy < 0 ? -1 : 0
    }
    const [ a, b ] = tan(intersect)
    a.x = creature.x + a.dx * creature.speed
    a.y = creature.y = a.dy * creature.speed
    b.x = creature.x + b.dx * creature.speed,
    b.y =  creature.y + b.dy * creature.speed
    if (dist(player, a) > dist(player, b))
        creature.move(a)
    else creature.move(b)
}

const target_step = (player, creature, { width, height }) => {
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

const red_creature = (creature) => ({
    ...creature,
    size: 10, 
    speed: 5, 
    color: [255, 0, 0], 
    proximity: 50,
    update_position(player, dims) {
        if (!is_movable(player, this)) return;
        this.last_position = { x: player.x, y: player.y }
        target_ahead(player, this, dims)
    }
})

const pink_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [188, 143, 143],
    proximity: 100,
    update_position(player, dims) {
        if (!is_movable(player, this)) return;
        this.last_position = { x: player.x, y: player.y }
        target_step(player, this, dims)
    }
})

const blue_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [0, 255, 0],
    proximity: 50,
    update_position(player, dims) {
        if (!is_movable(player, this)) return;
        this.last_position = { x: player.x, y: player.y }
        target_offset(player, this, dims)
    }
})

const orange_creature = (creature) => ({
    ...creature,
    size: 10,
    speed: 5,
    color: [255, 127, 0],
    proximity: 50,
    update_position(player, dims) {
        if (!is_movable(player, this)) return;
        const { x, y } = player
        this.last_position = { x, y }
        target_corner(player, this, dims)
    }
})


const types = {
    red: red_creature,
    pink: pink_creature,
    blue: blue_creature,
    orange: orange_creature
}

export const createCreature = (dims, player, type, position = { 
    x: Math.random() * dims.width, 
    y: Math.random() * dims.height 
}) => {
    if (!types.hasOwnProperty(type)) return false;
    const { x, y } = player
    const creature = {
        ...position,
        last_position: { x, y },
        move({ x, y }) {
            this.x = x
            this.y = y
        },
        render(p) {
            p.fill(...this.color)
            p.noStroke()
            p.circle(this.x, this.y, this.size)
        }
    }
    return types[type](creature)
}