export const point = (v, dv, speed) => v + dv * speed

// params: origin, pos
export const dir = ({ x, y }, { x: px, y: py }) => {
    let dx = px - x
    let dy = py - y
    if (dx !== 0) dx = dx / Math.abs(dx)
    if (dy !== 0) dy = dy / Math.abs(dy)
    return { dx, dy }
}

export const rev = (origin, pos) => {
    const { dx, dy } = dir(origin, pos)
    return { dx: -dx, dy: -dy }
}

// params: origin, pos
export const dist = ({ x, y }, { x: px, y: py }) => Math.sqrt((px - x) ** 2 + (py - y) ** 2)

export const in_bounds = ({ x, y }, { width, height }) => x < width && x > 0 && y < height && y > 0

export const cross_bound = (v, bound) => v > bound ? 1 
: v < 0 ? -1
: 0

// adjacent based on eight directions
// adj(N) => [NE, NW]
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

export default { point, dir, rev, dist, in_bounds, cross_bound, adj, tan }