import './css/styles.css'
import p5 from 'p5'
import { Player } from './player'
import { createCreature } from './stella'
import { Corral } from './corral';

const sketch = p => {
    const width = p.windowWidth
    const height = p.windowHeight
    const player = new Player({ x : 10, y : 10, size: 10 })
    const red = createCreature({ width, height }, player, 'red')
    const pink = createCreature({ width, height }, player, 'pink')
    
    p.setup = () => {
        p.createCanvas(width, height)
    };

    p.draw = () => {
        p.background(220)

        player.render(p)
        red.render(p)
        pink.render(p)

        updatePlayerPosition()
        red.updatePosition(player, { width, height })
        pink.updatePosition(player, { width, height })
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }

    const updatePlayerPosition = () => {
        if (p.keyIsDown(68) || p.keyIsDown(p.RIGHT_ARROW)) {
            player.right(p.width)
        }

        if (p.keyIsDown(65) || p.keyIsDown(p.LEFT_ARROW)) {
            player.left()
        }

        if (p.keyIsDown(83) || p.keyIsDown(p.DOWN_ARROW)) {
            player.down(p.height)
        }
        
        if (p.keyIsDown(87) || p.keyIsDown(p.UP_ARROW)) {
            player.up()
        }
    }

};

new p5(sketch, document.querySelector('body'));