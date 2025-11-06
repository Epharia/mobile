import { sprite as cfg } from "../../../config.mjs";
import { fillCircle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { Corpse } from "../../enemyDead.mjs";
import { Projectile } from "../../projectile.mjs";
import { Sprite } from "../sprite.mjs";
import { TaskHandler } from '../../ai/taskHandler.mjs';
import { EntityCollectible } from "../../entityCollectible.mjs";

export class Enemy extends Sprite {
    constructor(x = 0, y = 0, speed = 0, experience = 1) {
        super(x, y);
        this.damage = cfg.damage;
        this.speed = speed;
        this.experience = experience;
        this.tasks = new TaskHandler();
    }

    tick() {
        super.tick();
        if (this.hitAnimTimer > 0) this.hitAnimTimer -= Handler.delta;
    }

    hurt(value) {
        this.hp -= value;
        this.hitAnimTimer = .08;
        if (this.hp <= 0) {
            this.#onDeath();
        }
    }

    #onDeath() {
        ++Handler.world.score;
        Handler.world.entities.destroy(this);
        Handler.world.entities.add(new Corpse(this.pos, this.color));
        EntityCollectible.drop(this.pos, this.experience);
    }

    render(ctx) {
        super.render(ctx);
        ctx.save();
        if (this.hitAnimTimer > 0) {
            const alpha = 0.4;
            ctx.globalAlpha = alpha;
        }
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
        ctx.restore();
    }

    onCollision(other) {
        if (!other.alive) return;
        if (other instanceof Projectile) {
            if (other.isFriendly) {
                other.destroy();
                this.hurt(other.damage);
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