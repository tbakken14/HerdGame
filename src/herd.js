import { createCreature } from "./stella"

// const herd = ({ creatures }) => ({
//     creatures,
//     update_positions(player) {},
//     render(p) {
//         for (const creature of this.creatures)
//             creature.render(p)
//     }
// })

// export const createHerd = ({ width, height, type, n }) => {
//     if (!types.hasOwnProperty(type)) return false;

//     const creatures = new Array(n)
//     for (let i = 0; i < creatures.length; ++i) {
//         const x = Math.random() * width
//         const y = Math.random() * height
//         creatures[i] = types[type]({ x, y })
//     }

//     return herd({ creatures })
// }