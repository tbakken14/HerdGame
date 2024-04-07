export class Player {
    constructor({ x, y, size }) {
        this.x = x
        this.y = y
        this.size = size
        this.speed = 5
    }

    left() { 
        let { x, speed, size } = this
        if (x - speed > 0 - size / 2)
            x -= speed
        else x = 0 - size / 2
        this.x = x 
    }

    right(width) { 
        let { x, speed, size } = this
        if (x + speed < width - size / 2)
            x += speed
        else x = width - size / 2
        this.x = x
    }

    up() { 
        let { y, speed, size } = this
        if (y - speed > 0 - size / 2)
            y -= speed
        else y = 0 - size / 2
        this.y = y
    }

    down(height) { 
        let { y, speed, size } = this
        if (y + speed < height - size / 2)
            y += speed
        else y = height - size / 2
        this.y = y
    }

    render(p) {
        p.fill(200)
        p.stroke(10)
        p.strokeWeight(1)
        p.square(this.x, this.y, this.size)
    }
}