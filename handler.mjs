import { KeyboardHandler } from './input/keyboard.mjs';
import { MouseHandler } from './input/mouse.mjs';
import { TouchHandler } from './input/touch.mjs';

export class Handler {
    /** @type {Number} */
    static delta;

    /** @type {HTMLElement} */
    static canvas;

    /** @type {KeyboardHandler} */
    static keyboard;

    /** @type {MouseHandler} */
    static mouse;

    /** @type {TouchHandler} */
    static touch;

    /** @type {World} */
    static world;

    /**
     * Initialize the global handler
     * @param {HTMLElement} canvas
     */
    static async init(canvas) {
        Handler.canvas = canvas;
        Handler.keyboard = new KeyboardHandler();
        Handler.mouse = new MouseHandler();
        Handler.touch = new TouchHandler();

        //TODO find a better Solution, Rework handler?
        //avoid circular Imports
        const { World } = await import('./world/world.mjs');
        Handler.world = new World();
        Handler.world.init();
    }

    static get height() {
        return Handler.world.height;
    }

    static get width() {
        return Handler.world.width;
    }
}