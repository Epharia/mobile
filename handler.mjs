import { InputHandler } from './input/input.mjs';
import { TouchHandler } from './input/touch.mjs';
import { World } from './world/world.mjs';

export class Handler {
    /** @type {Number} */
    static delta;
    static game;

    /** @type {Boolean} */
    static isMobile;

    /** @type {InputHandler} */
    static input;

    /** @type {TouchHandler} */
    static touch;

    /** @type {World} */
    static world;

    static init(game) {
        Handler.game = game;
        Handler.input = new InputHandler();
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