import { player as cfg } from "../../config.mjs";
import { fillCircle } from "../../gfx/gfxLib.mjs";
import { Handler } from "../../handler.mjs";
import { Vector2D } from "../../util/vector2D.mjs";
import { Projectile } from "../projectile.mjs";
import { Sprite } from "./sprite.mjs";

export class Enemy extends Sprite {
    static damp = 1; //TEMP
    constructor(x = 0, y = 0, speed = 400) {
        super(x, y);
        this.speed = speed;
        this.acceleration = 500;

        this.hp = 5;
        this.damage = 6;

        this.hitAnimTimer = 0;

        this.direction = new Vector2D();
    }

    tick() {
        if (this.hp < 0) {
            ++Handler.world.score;
            Handler.world.entities.destroy(this);
        }
        if (this.hitAnimTimer > 0) this.hitAnimTimer -= Handler.delta;
        this.updateDirection();
        this._move();
        super.normalizeVelocity(this.speed);
        super.updatePosition();
    }

    _move() {
        this.velocity.addScaled(this.direction, this.acceleration * Handler.delta);
    }

    updateDirection() {
        //Calculate direction of Player
        let player = Handler.world.player;
        this.direction = new Vector2D(this.pos.x, this.pos.y);
        this.direction.sub(player.pos).normalize().negate();

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
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, "#E9B63B");
        if (this.hitAnimTimer > 0) {
            const alpha = this.hitAnimTimer;
            fillCircle(ctx, this.pos.x, this.pos.y, this.radius, `rgba(0,0,0,${alpha})`);
        }
    }

    onCollision(other) {
        if (other instanceof Projectile) {
            this.hp -= cfg.damage;
            this.hitAnimTimer = 1;
        }
    }
}