import { Entity } from "./entity.mjs";
import { Collider } from "../util/bounds/collider.mjs";

export class EntityCollidable extends Entity {
    constructor(x = 0, y = 0, radius = 32) {
        super(x, y)
        this.radius = radius;
        this.collider = new Collider(this.pos, this.radius);
    }

    /**
    * check collision between this entity and another
    * @param {EntityCollidable} other 
    */
    checkCollision(other) {
        return this.collider.intersects(other.collider);
    }

    /**
     * called on collision
     * @abstract
     * @param {EntityCollidable} other 
     */
    onCollision(other) { }
}