import './css/styles.css'
import p5 from 'p5';
import { createPlayer } from './avatar';


const sketch = p => {
    const width = p.windowWidth
    const height = p.windowHeight
    const player = createPlayer({ x : 10, y : 10, size: 10 })
    
    p.setup = () => {
        p.createCanvas(width, height);
    };

    
    p.draw = () => {
        p.background(220);
        p.fill(200);

        player.render(p);
        updatePlayerPosition();
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }

    function updatePlayerPosition() {
        if (p.keyIsDown(68)) {
            player.right(p.width)
        }
        if (p.keyIsDown(65)) {
            player.left()
        }
        if (p.keyIsDown(83)) {
            player.down(p.height)
        }
        if (p.keyIsDown(87)) {
            player.up()
        }
        /**
         * W = 87
         * A = 65
         * S = 83
         * D = 68
         */
    }

};

new p5(sketch, document.querySelector('body'));