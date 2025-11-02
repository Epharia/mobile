import { player as cfg } from "../../../config.mjs";
import { fillCircle, fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { State } from "../../../states/State.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { Projectile } from "../../projectile.mjs";
import { Enemy } from "../enemies/enemy.mjs";
import { Sprite } from "../sprite.mjs";

export class Player extends Sprite {
    constructor() {
        super(cfg.radius + 32, Handler.height - cfg.radius - 32);

        this.radius = cfg.radius;

        this.hp = cfg.hp;
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
        this.#move();
        this.#aim();
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
        let projectile = new Projectile(this, this.orientation, cfg.damage, this.speedMax * 2, posWeapon.x, posWeapon.y);
        Handler.world.entities.add(projectile);
        this.attackDelayTimer = cfg.attackDelay;
    }

    #move() {
        //TODO outsource to an InputHandler
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
        this.deccelerate(this.friction);

        const inputNormal = move.normalize();
        this.accelerate(inputNormal, this.acceleration);
    }

    #aim() {
        //Mouse
        const mouse = Handler.mouse;
        if (mouse.isActive) {
            let mx = mouse.x;
            let my = mouse.y;
            const canvas = Handler.canvas;
            const rect = canvas.getBoundingClientRect();

            //Adjust for world Scaling
            mx = (mouse.x - rect.left) * (canvas.width / rect.width);
            my = (mouse.y - rect.top) * (canvas.height / rect.height);
            mx = (mx - Handler.world.offsetX) / Handler.world.scale;
            my = (my - Handler.world.offsetY) / Handler.world.scale;

            this.orientation = new Vector2D(mx, my).sub(this.pos).normalize();
        }

        //Joystick
        let aim = Handler.touch.joysticks.aim.input.normalize();
        if (!aim.equals(Vector2D.zero)) {
            this.orientation = aim;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        super.render(ctx);

        fillTriangle(ctx,
            this.pos.x + this.orientation.x * (this.radius + (this.radius / 4) + cfg.gap), // X Position around Circle
            this.pos.y + this.orientation.y * (this.radius + (this.radius / 4) + cfg.gap), // Y Position around Circle
            this.radius, this.radius / 2, this.orientation.angle);

        ctx.save();
        if (this.hitAnimTimer > 0) {
            const alpha = .4;
            ctx.globalAlpha = alpha
        }
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, 'white');
        ctx.restore();
    }

    #onHit(damage) {
        if (this.iFramesTimer) return;
        this.hp -= damage;
        if (this.hp <= 0) State.requestState(State.death);
        this.iFramesTimer = cfg.iFrames;
        this.hitAnimTimer = .08;
    }

    onCollision(other) {
        if (other instanceof Enemy) {
            this.#onHit(other.damage);
        }
        if (other instanceof Projectile) {
            if (!other.isFriendly) {
                this.#onHit(other.damage);
                other.destroy();
            }
        }
    }
}