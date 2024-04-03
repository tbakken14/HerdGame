import { create_ghost_s } from "./stella";

const moveLeft = ({ x, speed, size }) => {
    if (x - speed > 0 - size / 2)
        x -= speed
    else x = 0 - size / 2
    return x
}

const moveRight = ({ x, speed, size, width }) => {
    if (x + speed < width - size / 2)
        x += speed
    else x = width - size / 2
    return x
}

const moveUp = ({ y, speed, size }) => {
    if (y - speed > 0 - size / 2)
        y -= speed
    else y = 0 - size / 2
    return y
}

const moveDown = ({ y, speed, size, height }) => {
    if (y + speed < height - size / 2)
        y += speed
    else y = height - size / 2
    return y
}

export const createPlayer = ({ x, y, size }) => ({
    x, 
    y,
    size,
    speed: 10,
    left() { moveLeft({ x: this.x, speed: this.speed, size: this.size }) },
    right(width) { moveRight({ x: this.x, speed: this.speed, size: this.size, width }) },
    up() { moveUp({ y: this.y, speed: this.speed, size: this.size }) },
    down(height) { moveDown({ y: this.y, speed: this.speed, size: this.size, height }) },
    render(p) {
        p.fill(200)
        p.square(this.x, this.y, this.size)
    }
})

export const createCreature = ({ x, y, size, speed }) => ({
    x, y, size, speed,
    move({ x, y }) {
        this.x = x
        this.y = y
    },
    isInCorral({ creature, x, y, width, height }) {
        return creature.x > x && creature.x < x + width && creature.y > y && creature.y < y + height
    },
    render(p) {
        p.fill(200)
        p.circle(this.x, this.y, this.size)
    }
})


const herd = ({ create, n }) => ({
    creatures: new Array(n).fill('').map(a => create(type))
})

export const createHerd = ({ type, n }) => {
    switch (type) {
        case 'ghost':
            return herd({ create: create_ghost_s, n })
    }
}