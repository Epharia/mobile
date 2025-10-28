import { fillCircle } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { EntityCollidable } from "./entityCollidable.mjs";

export class EntityProjectile extends EntityCollidable {
    /**
     * Projectile
     * @param {Entity} origin 
     */
    constructor(origin, direction = Vector2D.right, speed = 2000, x = origin.pos.x, y = origin.pos.y, radius = 8) {
        super(x, y, radius);
        this.origin = origin;
        this.direction = direction;
        this.speed = speed;
        this.isFriendly = origin == Handler.world.player;
        this.fillStyle = (this.isFriendly) ? 'rgba(77, 109, 190, .5)' : 'rgba(172, 87, 187, .5)'
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

    onCollision(other) {
        if (this.isFriendly && other == Handler.world.player ||
            !this.isFriendly && other != Handler.world.player) return;
        if (this.isFriendly) ++Handler.world.score;
        Handler.world.entities.destroy(other);
        Handler.world.entities.destroy(this);
    }
}