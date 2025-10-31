import { player as cfg } from "../../../config.mjs";
import { fillCircle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { Projectile } from "../../projectile.mjs";
import { Sprite } from "../sprite.mjs";

export class Enemy extends Sprite {
    static damp = 1; //TEMP
    constructor(x = 0, y = 0, speed = 400) {
        super(x, y);
        this.speed = speed;
        this.acceleration = 500;

        this.hp = 4;
        this.damage = 7;

        this.hitAnimTimer = 0;

        this.direction = new Vector2D();

        this.color = "#E9B63B";
    }

    tick() {
        if (this.hp <= 0) {
            ++Handler.world.score;
            Handler.world.entities.destroy(this);
        }
        if (this.hitAnimTimer > 0) this.hitAnimTimer -= Handler.delta;
        this._updateDirection();
        this._adjustDirection();
        this._move();
        super.normalizeVelocity();
        super.updatePosition();
    }

    _move() {
        this.velocity.addScaled(this.direction, this.acceleration * Handler.delta);
    }

    get playerDirection() {
        //Calculate direction of Player
        const player = Handler.world.player;
        const direction = this.pos.copy;
        return direction.sub(player.pos).normalize().negate();
    }

    _updateDirection() {
        this.direction = this.playerDirection;
    }

    _adjustDirection() {
        //Prevent enemies convergance
        let enemies = Handler.world.entities.list.filter((e) => e instanceof Enemy);
        if (enemies.length == 0) return;
        for (let e of enemies) {
            const offset = new Vector2D(this.pos.x, this.pos.y).sub(e.pos);
            const distance2 = offset.magnitude2;
            if (distance2 == 0) continue;
            const strength = (5000 / (distance2)) / Enemy.damp;
            this.direction.addScaled(offset.normalize(), strength);
        }
    }

    render(ctx) {
        super.render(ctx);
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
        if (this.hitAnimTimer > 0) {
            const alpha = this.hitAnimTimer;
            fillCircle(ctx, this.pos.x, this.pos.y, this.radius, `rgba(0,0,0,${alpha})`);
        }
    }

    onCollision(other) {
        if (!other.alive) return;
        if (other instanceof Projectile) {
            if (other.isFriendly) {
                other.destroy();
                this.hp -= other.damage;
                this.hitAnimTimer = 1;
            }
        }

        if (other instanceof Enemy) {
            const normal = this.pos.copy.sub(other.pos).normalize();
            const relativeVelocity = this.velocity.copy.sub(other.velocity);
            const penetrationSpeed = normal.copy.dot(relativeVelocity);
            if (penetrationSpeed > 0) return;
            this.velocity.addScaled(normal, -penetrationSpeed);
        }
    }
}