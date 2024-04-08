export const dir = (origin, pos) => {
    let dx = pos.x - origin.x
    let dy = pos.y - origin.y
    if (dx !== 0) dx = dx / Math.abs(dx)
    if (dy !== 0) dy = dy / Math.abs(dy)
    return { dx, dy }
}

export const rev = (origin, pos) => {
    const { dx, dy } = dir(origin, pos)
    return { dx: -dx, dy: -dy }
}

export const dist = ({ x: ox, y: oy }, { x: px, y: py }) => Math.sqrt((px - ox) ** 2 + (py - oy) ** 2)

// adjacent based on eight directions: adj(N) => [NE, NW]
export const adj = ({ dx, dy }) => {
    if (dx === 0) return [{ dx: -1, dy }, { dx: 1, dy }]
    if (dy === 0) return [{ dx, dy: -1 }, { dx, dy: 1 }]
    return [{ dx, dy: 0 }, { dx: 0, dy }]
}

// tangent based on perpendiculars:
// tan(N) => [E, W]
// tan(NE) => [S, W]
// Use for intersection with boundaries, intersection = { dx, dy }
export const tan = ({ dx, dy }) => {
    if (dx === 0) return [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }]
    if (dy === 0) return [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }]
    return [{ dx: -dx, dy: 0 }, { dx: 0, dy: -dy }]
}

export default { dir, dist, adj, tan }