import { Handler } from './handler.mjs';
import { State } from './states/State.mjs';

globalThis.addEventListener('load', async function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = globalThis.innerWidth;
    canvas.height = globalThis.innerHeight;

    State.init();
    await Handler.init(canvas);

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
    canvas.width = globalThis.innerWidth;
    canvas.height = globalThis.innerHeight;
    Handler.world.calculateScale();
}
globalThis.addEventListener('resize', resize);
globalThis.addEventListener('orientationchange', resize);

//Temporary solution to activate fullscreen
//TODO add toggle fullscreen button
globalThis.addEventListener('pointerup', fullscreen, { passive: false });

async function fullscreen(e) {
    globalThis.removeEventListener("pointerup", fullscreen);
    try {
        await document.getElementById('canvas').requestFullscreen();
    } catch (err) {
        console.error(err.name, err.message);
    }
}