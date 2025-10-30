import { KeyboardHandler } from './input/keyboard.mjs';
import { MouseHandler } from './input/mouse.mjs';
import { TouchHandler } from './input/touch.mjs';
import { World } from './world/world.mjs';

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

    static init(canvas) {
        Handler.canvas = canvas;
        Handler.keyboard = new KeyboardHandler();
        Handler.mouse = new MouseHandler();
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