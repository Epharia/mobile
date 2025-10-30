import { KeyboardHandler } from './input/keyboard.mjs';
import { TouchHandler } from './input/touch.mjs';
import { World } from './world/world.mjs';

export class Handler {
    /** @type {Number} */
    static delta;
    /** @type {HTMLElement} */
    static canvas;

    /** @type {KeyboardHandler} */
    static keyboard;

    /** @type {TouchHandler} */
    static touch;

    /** @type {World} */
    static world;

    static init(canvas) {
        Handler.canvas = canvas;
        Handler.keyboard = new KeyboardHandler();
        Handler.touch = new TouchHandler();
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