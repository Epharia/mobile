import { player as cfg } from "../../../config.mjs";
import { fillCircle, fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { State } from "../../../states/State.mjs";
import { StatePause } from "../../../states/StatePause.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { Projectile } from "../../projectile.mjs";
import { Enemy } from "../enemy.mjs";
import { Sprite } from "../sprite.mjs";

export class Player extends Sprite {
    constructor() {
        super(cfg.radius + 32, Handler.height - cfg.radius - 32);

        this.radius = cfg.radius;

        this.speed = cfg.speed;
        this.speedMax = cfg.speed;
        this.acceleration = cfg.acceleration + cfg.friction;
        this.friction = cfg.friction;

        this.hitAnimTimer = 0;
        this.iFramesTimer = 0;
        this.attackDelayTimer = cfg.attackDelay;

        this.orientation = Vector2D.right;
    }

    tick() {
        if (this.hitAnimTimer > 0) this.hitAnimTimer -= Handler.delta;
        if (this.iFramesTimer > 0) this.iFramesTimer -= Handler.delta;
        else this.iFramesTimer = 0;
        if (Handler.touch.tapped) { State.requestState(State.pause); }
        this._move();
        super.normalizeVelocity(this.speed);
        super.updatePosition();
        this.attack();
    }

    attack() {
        if (this.attackDelayTimer > 0) {
            this.attackDelayTimer -= Handler.delta;
            return;
        }
        let posWeapon = this.pos.copy.addScaled(this.orientation, (this.radius + (this.radius >> 1) + cfg.gap));
        let projectile = new Projectile(this, this.orientation, this.speedMax * 2, posWeapon.x, posWeapon.y);
        Handler.world.entities.add(projectile);
        this.attackDelayTimer = cfg.attackDelay;
    }

    _move() {
        let move = Handler.touch.joysticks.move.input;

        let keyboard = false;
        if (move.equals(Vector2D.zero)) {
            this.speed = this.speedMax;
            //Horizontal Input
            let left = Handler.keyboard.keys.left.held,
                right = Handler.keyboard.keys.right.held;
            if (right && !left) {
                move = Vector2D.right;
            } else if (!right && left) {
                move = Vector2D.left;
            }


            //Vertical Input
            let up = Handler.keyboard.keys.up.held,
                down = Handler.keyboard.keys.down.held;
            if (down && !up) {
                move.add(Vector2D.down);
            } else if (!down && up) {
                move.add(Vector2D.up);
            }

            if (left || up || down || right) keyboard = true;
        } else {
            this.speed = Math.ceil(move.magnitude * this.speedMax);
            if (this.speed >= this.speedMax) this.speed = this.speedMax;
        }

        //Friction
        if (this.velocity.magnitude2 > (this.friction * this.friction) * (Handler.delta * Handler.delta)) {
            this.velocity.addScaled(this.velocity.copy.negate().normalize(), this.friction * Handler.delta);
        } else {
            this.velocity = Vector2D.zero;
        }

        //TODO add full keyboard & mouse interaction
        if (keyboard) {
            if (!this.velocity.equals(Vector2D.zero)) {
                this.orientation = this.velocity.copy;
                this.orientation.normalize();
            }
        }

        let aim = Handler.touch.joysticks.aim.input.normalize();
        if (!aim.equals(Vector2D.zero)) {
            this.orientation = aim;
        }

        const inputNormal = move.normalize();
        this.velocity.x += inputNormal.x * this.acceleration * Handler.delta;
        this.velocity.y += inputNormal.y * this.acceleration * Handler.delta;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        super.render(ctx);
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, 'white');
        fillTriangle(ctx,
            this.pos.x + this.orientation.x * (this.radius + (this.radius >> 2) + cfg.gap), // X Position around Circle
            this.pos.y + this.orientation.y * (this.radius + (this.radius >> 2) + cfg.gap), // Y Position around Circle
            this.radius, this.radius / 2, this.orientation.angle);

        if (this.hitAnimTimer > 0) {
            const alpha = this.hitAnimTimer * 2;
            fillCircle(ctx, this.pos.x, this.pos.y, this.radius, `rgba(0, 0, 0, ${alpha})`);
        }
    }

    onCollision(other) {
        if (other instanceof Enemy) {
            if (this.iFramesTimer) return;
            this.hp -= other.damage;
            if (this.hp <= 0) State.requestState(State.death);
            this.iFramesTimer = cfg.iFrames;
            this.hitAnimTimer = .5;
        }
    }
}