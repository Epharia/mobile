import { Entity } from "./entity.mjs";
import { Handler } from "../handler.mjs";
import { player } from "../config.mjs";

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
        //TODO rework collision handler or find another way to remove the modifier here
        const modifier = (Handler.world?.player &&
            (other == Handler.world.player || this == Handler.world.player)) ? player.collisionBuffer : 0;

        const radius = this.radius + other.radius - modifier;
        return this.pos.copy.sub(other.pos).magnitude2 < radius * radius;
    }

    /**
     * called on collision
     * @abstract
     * @param {EntityCollidable} other 
     */
    onCollision(other) { }
}