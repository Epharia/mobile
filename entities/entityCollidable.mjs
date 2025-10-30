import { Entity } from "./entity.mjs";
import { AABB } from "../util/aabb.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { Handler } from "../handler.mjs";

export class EntityCollidable extends Entity {
    constructor(x = 0, y = 0, radius = 32) {
        super(x, y)

        this.radius = radius;
    }

    /**
    * check collision between this entity and another
    * @param {EntityCollidable} other 
    */
    checkCollision(other) {
        let modifier = other == Handler.world.player ? 2 : 0; //TODO move to player
        return this.pos.copy.sub(other.pos).magnitude < this.radius + other.radius - modifier;
    }

    /**
     * called on collision
     * @abstract
     * @param {EntityCollidable} other 
     */
    onCollision(other) { }
}