import { Handler } from './handler.mjs';
import { State } from './states/State.mjs';

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;

    State.init();
    Handler.init(canvas);

    let lastTime = 0;
    function loop(time) {
        Handler.delta = (time - lastTime) / 1000;
        Handler.delta = Math.min(Handler.delta, 0.1);
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        State.tick();
        State.render(ctx);

        State.update();

        ctx.resetTransform();

        requestAnimationFrame(loop);
    }
    this.requestAnimationFrame(loop);
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Handler.world.calculateScale();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);