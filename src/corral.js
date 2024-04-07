import { direction } from "./calc"

export class Corral {
    constructor({ width, height, size }) {
        this.x = Math.random() * (width - size)
        this.y = Math.random() * (height - size)
        this.size = size
        this.gate = {
            x: this.x - this.size / 4,
            y: this.y + this.size / 4,
            size: this.size / 2
        }
    }

    // collision: returns point of collision or final point
    collides({ xi, yi, xf, yf }) {}

    isInCorral({ x, y }) {
        return x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size
    }

    render(p) {
        p.noFill()
        p.stroke(0)
        p.strokeWeight(5)
        p.square(this.x, this.y, this.size)

        p.fill(220)
        p.noStroke()
        const { x, y, size } = this.gate
        p.square(x, y, size)
    }
}