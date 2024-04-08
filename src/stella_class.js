import { adj_directions, direction, dist, tan_directions } from "./calc"

class Creature {
    constructor({ x, y, size, speed, color, last_position, proximity }) {
        this.x = x
        this.y = y
        this.size = size
        this.speed = speed
        this.color = color
        this.prox = proximity
        this.last_pos = last_position
    }

    move({ x, y }) {
        this.x = x
        this.y = y
    }

    render(p) {
        p.fill(...this.color)
        p.noStroke()
        p.circle(this.x, this.y, this.size)
    }
}

/* Target position equidistant from point to ghost as ghost to player */
class Red extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({ 
            x, y, size: 10, speed: 5, 
            color: [255, 0, 0], 
            proximity: 50,
            last_position: { x: px, y: py }
        })
    }

    updatePosition({ x, y }, { width, height }, corral) {
        if ((this.last_pos.x === x && this.last_pos.y === y) 
        || dist({ x, y }, { x: this.x, y: this.y }) > this.prox) 
            return;

        this.last_pos.x = x
        this.last_pos.y = y

        const { dx, dy } = direction({ x, y }, this)
        const [sx, sy] = [this.x + dx * this.speed, this.y + dy * this.speed]
        if (sx < width && sx > 0 && sy < height && sy > 0) {
            this.move({ x: sx, y: sy })
            return;
        }

        const intersect = {
            dx: sx > width ? 1 : sx < 0 ? -1 : 0,
            dy: sy > height ? 1 : sy < 0 ? -1 : 0
        }
        const [a, b] = tan_directions(intersect)
        const [ax, ay] = [this.x + a.dx * this.speed, this.y + a.dy * this.speed]
        const [bx, by] = [this.x + b.dx * this.speed, this.y + b.dy * this.speed]

        if (dist({ x, y }, { x: ax, y: ay }) > dist({ x, y }, { x: bx, y: by }))
            this.move({ x: ax, y: ay })
        else
            this.move({ x: bx, y: by })
    }

    
}

class Pink extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [188, 143, 143],
            proximity: 50,
            last_position: { x: px, y: py }
        })
    }

    updatePosition({ x, y, speed }, { width, height }, corral) {
        if ((this.last_pos.x === x && this.last_pos.y === y) 
        || dist({ x, y }, { x: this.x, y: this.y }) > this.prox) 
            return;

        this.last_pos.x = x
        this.last_pos.y = y

        const { dx, dy } = direction({ x, y }, this)
        const [ left, right ] = adj_directions({ dx, dy })
        const lx = x + left.dx * speed
        const ly = y + left.dy * speed
        const rx = x + right.dx * speed
        const ry = y + right.dy * speed

        const { dx: ax, dy: ay } = direction({ x: lx, y: ly }, this)
        const { dx: bx, dy: by } = direction({ x: rx, y: ry }, this)
    }

    updatePos({ x, y, speed }, { width, height }, corral) {
        if ((this.last_pos.x === x && this.last_pos.y === y) 
        || dist({ x, y }, { x: this.x, y: this.y }) > this.prox) 
            return;

        this.last_pos.x = x
        this.last_pos.y = y

        const { dx, dy } = direction({ x, y }, this)
        const [ left, right ] = adj_directions({ dx, dy })
        const lx = x + left.dx * speed
        const ly = y + left.dy * speed
        const rx = x + right.dx * speed
        const ry = y + right.dy * speed

        const { dx: ax, dy: ay } = direction({ x: lx, y: ly }, this)
        const { dx: bx, dy: by } = direction({ x: rx, y: ry }, this)
    }
}

class Blue extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [0, 255, 0],
            proximity: 50,
            last_position: { x: px, y: py }
        })
    }

    updatePosition(player, dims) {}
}

class Orange extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [255, 127, 0],
            proximity: 50,
            last_position: { x: px, y: py }
        })
    }

    updatePosition(player, dims) {}
}

const types = {
    red: Red,
    pink: Pink,
    blue: Blue,
    orange: Orange
}

export const createCreature = (dims, player, type, position = { 
    x: Math.random() * dims.width, 
    y: Math.random() * dims.height 
}) => {
    if (!types.hasOwnProperty(type)) return false;
    return new types[type](position, player)
}