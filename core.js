import { Engine } from './engine/engine.mjs';
import { TransformComponent } from './entity/components/transformComponent.mjs';
import { MovementSystem } from './entity/systems/movementSystem.mjs';

globalThis.addEventListener('load', async function () {
    const canvas = document.getElementById('canvas');
    const engine = new Engine(canvas);
    await engine.init();

    //TODO REMOVE THIS TEST
    engine.systems.addSystem(new MovementSystem(engine.entities));
    const test = engine.entities.createEntity('test');
    test.addComponent(new TransformComponent(0, 100));
    //TEST END

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
