export const direction = (origin, pos) => {
    let dx = pos.x - origin.x
    let dy = pos.y - origin.y
    if (dx !== 0) dx = dx / Math.abs(dx)
    if (dy !== 0) dy = dy / Math.abs(dy)
    return { dx, dy }
}

export const dist = ({ x: ox, y: oy }, { x: px, y: py }) => Math.sqrt((px - ox) ** 2 + (py - oy) ** 2)

// adjacent
export const adj_directions = ({ dx, dy }) => {
    if (dx === 0) return [{ dx: -1, dy }, { dx: 1, dy }]
    if (dy === 0) return [{ dx, dy: -1 }, { dx, dy: 1 }]
    return [{ dx, dy: 0 }, { dx: 0, dy }]
}

// tangent: use for boundaries
export const tan_directions = ({ dx, dy }, intersect) => {
    if (intersect.x && intersect.y) 
        return [{ dx: -dx, dy: 0 }, { dx: 0, dy: -dy }]

    if (dx === 0 || intersect.x) 
        return [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
    if (dy === 0 || intersect.y) 
        return [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }]
}

