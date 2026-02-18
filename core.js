import { Engine } from './engine/engine.mjs';
import { Scene } from './systems/Scene.mjs';

globalThis.addEventListener('load', async function () {
    const canvas = document.getElementById('canvas');
    const engine = new Engine(canvas);
    await engine.init();

    engine.start();
});

function resize() {
    if (!engine) return;
    
    const newWidth = globalThis.innerWidth;
    const newHeight = globalThis.innerHeight;
    
    engine.setCanvasSize(newWidth, newHeight);
    engine.events.emit('engine:resize', { width: newWidth, height: newHeight });
}

globalThis.addEventListener('resize', resize);
globalThis.addEventListener('orientationchange', resize);

globalThis.addEventListener('beforeunload', () => {
    if (engine) {
        engine.shutdown();
    }
});
