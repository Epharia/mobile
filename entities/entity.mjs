import { Handler } from "../handler.mjs";
import { Vector2D } from "../util/vector2D.mjs";

export class Entity {
    alive = true;
    constructor(x, y) {
        this.pos = new Vector2D(x, y);
    }

    /**
     * @abstract
     */
    tick() { /* override in subclasses */ }

    /**
     * @abstract
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) { /* override in subclasses */ }

    /**
     * Marks this entity as dead and
     * remove it from the entityManager
     */
    destroy() {
        this.alive = false;
        Handler.world.entities.destroy(this);
    }
}