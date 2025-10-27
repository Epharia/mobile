import { Handler } from './handler.mjs';
import { Conf } from './config.mjs';
import { State } from './states/State.mjs';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = Conf.WIDTH;
    canvas.height = Conf.HEIGHT;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            State.init();
            Handler.init(this, canvas);

            Handler.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && !/Windows/i.test(navigator.userAgent));
        }

        tick() {
            State.tick();
        }

        render(ctx) {
            State.render(ctx);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function loop(time) {
        Handler.delta = (time - lastTime) / 1000;
        Handler.delta = Math.min(Handler.delta, 0.1);
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.tick();
        game.render(ctx);

        State.update();

        ctx.resetTransform();

        requestAnimationFrame(loop);
    }
    this.requestAnimationFrame(loop);
});

//TODO
// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// }
// resize();
// window.addEventListener('resize', resize);