import { fillCircle } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { EntityCollidable } from "./entityCollidable.mjs";

export class Projectile extends EntityCollidable {
    /**
     * Projectile
     * @param {Entity} origin 
     */
    constructor(origin, direction = Vector2D.right, damage = 1, speed = 2000, x = origin.pos.x, y = origin.pos.y, radius = 8) {
        super(x, y, radius);
        this.origin = origin;
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.isFriendly = origin == Handler.world.player;
        this.fillStyle = (this.isFriendly) ? 'rgba(77, 190, 167, 0.5)' : 'rgba(255, 100, 100, 1)'
    }

    tick() {
        this.pos.addScaled(this.direction, this.speed * Handler.delta);

        //Bounds
        if (this.pos.y > Handler.world.height - this.radius ||
            this.pos.y - this.radius < 0 ||
            this.pos.x - this.radius < 0 ||
            this.pos.x > Handler.world.width - this.radius) {
            Handler.world.entities.destroy(this);
        }
    }

    render(ctx) {
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.fillStyle);
    }
}