import { player as cfg } from "../../../config.mjs";
import { fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { Projectile } from "../../projectile.mjs";
import { Enemy } from "./enemy.mjs";

const attackDelayMin = 2;
const attackDelayMax = 3;


export class EnemyRanged extends Enemy {
    constructor(x = 0, y = 0, speed = 100) {
        super(x, y, speed);
        const distanceToPlayer = 700;
        const distanceDeadzone = 100;
        this.minDist2 = distanceToPlayer * distanceToPlayer;
        this.buffer = (distanceToPlayer - distanceDeadzone) * (distanceToPlayer - distanceDeadzone);
        this.color = "#628cffff"

        this.damageRanged = 3;
        this.hp = 3;

        this.attackDelayTimer = this.attackDelay;
    }

    get attackDelay() {
        return attackDelayMin + attackDelayMax * Math.random();
    }

    tick() {
        if (this.hp <= 0) {
            ++Handler.world.score;
            Handler.world.entities.destroy(this);
        }
        if (this.hitAnimTimer > 0) this.hitAnimTimer -= Handler.delta;
        super._updateDirection();
        super._adjustDirection();
        this._move();
        super.normalizeVelocity(this.speed);
        super.updatePosition();
        this._attack();
    }

    _move() {
        const distance2 = this.pos.copy.sub(Handler.world.player.pos).magnitude2;
        if (distance2 > this.minDist2) {
            this.velocity.addScaled(this.direction, this.acceleration * Handler.delta);
        } else if (distance2 < this.buffer) {
            this.velocity.addScaled(this.playerDirection, -this.acceleration * Handler.delta);
        } else if (this.velocity.magnitude > 2 * this.acceleration * Handler.delta) {
            this.velocity.addScaled(this.velocity.copy.normalize().negate(), 2 * this.acceleration * Handler.delta);
        } else {
            this.velocity = Vector2D.zero;
        }
    }

    _attack() {
        if (this.attackDelayTimer > 0) {
            this.attackDelayTimer -= Handler.delta;
            return;
        }
        const player = Handler.world.player;
        const dirPlayer = player.pos.copy.sub(this.pos).normalize();
        const dir = dirPlayer; //Adjust with playermovement?

        let posWeapon = this.pos.copy.addScaled(dir, (this.radius + (this.radius >> 1) + cfg.gap));
        let projectile = new Projectile(this, dir, this.damageRanged, 1200, posWeapon.x, posWeapon.y);
        Handler.world.entities.add(projectile);
        this.attackDelayTimer = this.attackDelay;
    }

    render(ctx) {
        super.render(ctx);
        const dir = this.pos.copy.sub(Handler.world.player.pos).negate().normalize();
        fillTriangle(ctx,
            this.pos.x + dir.x * (this.radius + (this.radius / 8) + cfg.gap), // X Position around Circle
            this.pos.y + dir.y * (this.radius + (this.radius / 8) + cfg.gap), // Y Position around Circle
            this.radius / 2, this.radius / 4, dir.angle, this.color);
    }
}