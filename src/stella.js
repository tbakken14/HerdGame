const player_direction = (player, creature) => {
    const d = {
        x: creature.x - player.x,
        y: creature.y - player.y
    }

    if (d.x !== 0)
        d.x = d.x / Math.abs(d.x)
    if (d.y !== 0)
        d.y = d.y / Math.abs(d.y)

    return { dx: d.x, dy: d.y }
}

const adj_directions = ({ dx, dy }) => {
    if (dx === 0) 
        return [{ dx: -1, dy }, { dx: 1, dy }]
    if (dy === 0)
        return [{ dx, dy: -1 }, { dx, dy: 1 }]
    return [{ dx, dy: 0 }, { dx: 0, dy }]
}

const next_adj_direction = ({ dx, dy }, { lx, ly }) => {
    const [ alt_a, alt_b ] = adj_directions({ lx, ly })
    if (alt_a.dx === dx && alt_a.dy === dy)
        return alt_b
    return alt_a
}

const dist = ({ x: px, y: py }, { x: cx, y: cy }) => {
    return Math.sqrt((cx - px) ** 2 + (cy - py) ** 2)
}

class Creature {
    constructor({ x, y, size, speed, color, last_position }) {
        this.x = x
        this.y = y
        this.size = size
        this.speed = speed
        this.color = color
        this.last_pos = last_position
    }

    move({ x, y }) {
        this.x = x
        this.y = y
    }

    isInCorral({ x: cx, y: cy }, { x, y, width, height }) {
        return cx > x && cx < x + width && cy > y && cy < y + height
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
            last_position: { x: px, y: py }
        })
    }

    updatePosition(player, dims) {
        this.update_pos_by_edge(player, dims)
    }

    update_pos_by_edge({ x, y }, { width, height }) {
        if (this.last_pos.x === x && this.last_pos.y === y) 
            return true;
        else {
            this.last_pos.x = x
            this.last_pos.y = y
        }

        const { dx, dy } = player_direction({ x, y }, this)
        const coord = { x: this.x + dx * this.speed, y: this.y + dy * this.speed }

        if ((coord.x < 0 || coord.x > width) && (coord.y < 0 || coord.y > height)) {
            const sx = this.x + (dx * -1) * this.speed
            const sy = this.y + (dy * -1) * this.speed

            const dist_sx = dist({ x, y }, { x: sx, y: coord.y })
            const dist_sy = dist({ x, y }, { x: coord.x, y: sy })

            if (dist_sx > dist_sy) {
                coord.x = sx
                coord.y = this.y
            }
            else {
                coord.x = this.x
                coord.y = sy
            }
        }
        else if (coord.x < 0 || coord.x > width) {
            const sy_down = this.y + this.speed
            const sy_up = this.y - this.speed

            const dist_down = dist({ x, y }, { x: this.x, y: sy_down })
            const dist_up = dist({ x, y }, { x: this.x, y: sy_up})

            coord.x = this.x
            if (dist_down > dist_up)
                coord.y = sy_down
            else
                coord.y = sy_up
        }
        else if (coord.y < 0 || coord.y > height) {
            const sx_left = this.x - this.speed
            const sx_right = this.x + this.speed

            const dist_left = dist({ x, y }, { x: sx_left, y: this.y })
            const dist_right = dist({ x, y }, { x: sx_right, sy: this.y })

            coord.y = this.y
            if (dist_left > dist_right)
                coord.x = sx_left
            else
                coord.x = sx_right
        }

        this.x = coord.x
        this.y = coord.y
    }
    
    // Does not account for an alt(dx, dy) = [creature - player](dx, dy)
    update_pos_by_adj({ x, y }, { width, height }) {
        if (this.last_pos.x === x && this.last_pos.y === y) return true;

        const { dx, dy } = player_direction({ x, y }, this)
        const sx = this.x + dx * this.speed
        const sy = this.y + dy * this.speed
        if (sx < width && sx > 0 && sy < height && sy > 0) {
            this.move({ x: sx, y: sy })
            return true
        }

        let [ alt_a, alt_b ] = adj_directions({ dx, dy })

        let last_dx = dx, last_dy = dy
        while (alt_a.dx > width || alt_a.dx < 0 || alt_a.dy > height || alt_a.dy < 0) {
            alt_a = next_adj_direction({ x: last_dx, y: last_dy }, { lx: alt_a.dx, ly: alt_a.dy })
            last_dx = alt_a.dx
            last_dy = alt_a.dy
        }
            
        last_dx = dx, last_dy = dy
        while (alt_b.dx > width || alt_b.dx < 0 || alt_b.dy > height && alt_b.dy < 0) {
            alt_b = next_adj_direction({ x: last_dx, y: last_dy }, { lx: alt_b.dx, ly: alt_b.dy })
            last_dx = alt_b.dx
            last_dy = alt_b.dy
        }

        const ax = this.x + alt_a.dx * this.speed
        const ay = this.y + alt_a.dy * this.speed
        const bx = this.x + alt_b.dy * this.speed
        const by = this.y + alt_b.dy * this.speeed
        const dist_a = Math.sqrt((ax - x) ** 2 + (ay - y) ** 2)
        const dist_b = Math.sqrt((bx - x) ** 2 + (by - y) ** 2)

        if (dist_a > dist_b) {
            this.x = ax
            this.y = ay
        }
        else {
            this.x = bx
            this.y = by
        }
        return true
    }
}

class Pink extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [143, 143, 0],
            last_position: { x: px, y: py }
        })
    }

    update_position(player, dims) {}
}

class Blue extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [0, 255, 0],
            last_position: { x: px, y: py }
        })
    }

    update_position(player, dims) {}
}

class Orange extends Creature {
    constructor({ x, y }, { x: px, y: py }) {
        super({
            x, y, size: 10, speed: 5,
            color: [255, 127, 0],
            last_position: { x: px, y: py }
        })
    }

    update_position(player, dims) {}
}

const types = {
    red: Red,
    pink: Pink,
    blue: Blue,
    orange: Orange
}

export const createCreature = ({ width, height }, player, type, position = { 
    x: Math.random() * width, 
    y: Math.random() * height 
}) => {
    if (!types.hasOwnProperty(type)) return false;
    return new types[type](position, player)
}