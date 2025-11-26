import { Vector2D } from "../vector2D.mjs";

/**
 * this is handled as a circle collider, as those
 * are the only needed type of collision so far.
 */
export class Collider {
    #pos;
    #radius;

    /**
     * @param {Vector2D} pos 
     * @param {Number} radius 
     */
    constructor(pos, radius = 32) {
        this.#radius = radius;
        this.#pos = pos;
    }

    /**
     * Check if this intersects with another collider
     * @param {Collider} target
     */
    intersects(target) {
        const r = (this.#radius + target.#radius)
        return this.#pos.copy.sub(target.#pos).magnitude2 < r * r;
    }
}