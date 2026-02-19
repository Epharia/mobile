import { Engine } from './engine/engine.mjs';
import { TransformComponent } from './entity/components/transformComponent.mjs';
import { ShapeComponent } from './entity/components/shapeComponent.mjs';
import { MovementSystem } from './entity/systems/movementSystem.mjs';
import { RenderSystem } from './entity/systems/renderSystem.mjs';

let engine
globalThis.addEventListener('load', async function () {
    const canvas = document.getElementById('canvas');
    engine = new Engine(canvas);
    globalThis.engine = engine;
    await engine.init();

    //TODO REMOVE THIS TEST
    engine.systems.addSystem(new MovementSystem());
    engine.systems.addSystem(new RenderSystem());

    // Circle entity
    const circle = engine.entities.createEntity('circle');
    circle.addComponent(new TransformComponent(200, 150));
    circle.addComponent(ShapeComponent.circle(30, '#ff6b6b'));

    // Rectangle entity
    const rect = engine.entities.createEntity('rect');
    rect.addComponent(new TransformComponent(400, 150));
    const rectShape = ShapeComponent.rect(60, 40, '#4ecdc4');
    rectShape.strokeColor = '#ffffff';
    rectShape.strokeWidth = 2;
    rect.addComponent(rectShape);

    // Polygon (triangle) entity
    const triangle = engine.entities.createEntity('triangle');
    triangle.addComponent(new TransformComponent(600, 150));
    const triangleShape = ShapeComponent.polygon([
        { x: 0, y: -40 },
        { x: 35, y: 40 },
        { x: -35, y: 40 }
    ], '#ffe66d');
    triangle.addComponent(triangleShape);

    // Layered circles (test z-index)
    const backCircle = engine.entities.createEntity('back-circle');
    backCircle.addComponent(new TransformComponent(300, 300));
    const backShape = ShapeComponent.circle(50, '#95e1d3');
    backShape.zIndex = 0;
    backCircle.addComponent(backShape);

    const frontCircle = engine.entities.createEntity('front-circle');
    frontCircle.addComponent(new TransformComponent(320, 320));
    const frontShape = ShapeComponent.circle(40, '#f38181');
    frontShape.zIndex = 1;
    frontCircle.addComponent(frontShape);

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
