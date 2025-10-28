import { fillCircle, fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { State } from "../../../states/State.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { EntityProjectile } from "../../entitiyProjectile.mjs";
import { Enemy } from "../enemy.mjs";
import { Sprite } from "../sprite.mjs";

const iFrames = 0.25;
const attackDelay = .7;

export class Player extends Sprite {
    constructor() {
        super(20, Handler.height - 84);

        this.radius = 32;

        this.speed = 500;
        this.acceleration = 7500 + 5000;
        this.friction = 5000;

        this.iFramesTimer = 0;
        this.attackDelayTimer = this.attackDelay;

        this.orientation = Vector2D.right;
    }

    tick() {
        this.color = 'black';
        if (this.iFramesTimer > 0) this.iFramesTimer -= Handler.delta;
        else this.iFramesTimer = 0;
        this.move();
        super.normalizeVelocity();
        super.updatePosition();
        this.attack();
    }

    attack() {
        if (this.attackDelayTimer > 0) {
            this.attackDelayTimer -= Handler.delta;
            return;
        }
        let posWeapon = this.pos.copy.addScaled(this.orientation, this.radius + 16);
        let projectile = new EntityProjectile(this, this.orientation, this.speed * 2, posWeapon.x, posWeapon.y);
        Handler.world.entities.add(projectile);
        this.attackDelayTimer = attackDelay;
    }

    move() {
        let input = Handler.touch.move;;

        let keyboard = false;
        if (input.equals(Vector2D.zero)) {
            //Horizontal Input
            let left = Handler.input.keys.left.held,
                right = Handler.input.keys.right.held;
            if (right && !left) {
                input = Vector2D.right;
            } else if (!right && left) {
                input = Vector2D.left;
            }


            //Vertical Input
            let up = Handler.input.keys.up.held,
                down = Handler.input.keys.down.held;
            if (down && !up) {
                input.add(Vector2D.down);
            } else if (!down && up) {
                input.add(Vector2D.up);
            }

            if (left || up || down || right) keyboard = true;
        }

        //Friction
        if (this.velocity.magnitude2 > (this.friction * this.friction) * (Handler.delta * Handler.delta)) {
            this.velocity.addScaled(this.velocity.copy.negate().normalize(), this.friction * Handler.delta);
        } else {
            this.velocity = Vector2D.zero;
        }

        //TODO add mouse interaction
        if (keyboard) {
            if (!this.velocity.equals(Vector2D.zero)) {
                this.orientation = this.velocity.copy;
                this.orientation.normalize();
            }
        }

        let aim = Handler.touch.aim;
        if (!aim.equals(Vector2D.zero)) {
            this.orientation = aim;
        }

        this.velocity.x += input.x * this.acceleration * Handler.delta;
        this.velocity.y += input.y * this.acceleration * Handler.delta;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        super.render(ctx);
        let fillStyle = this.iFramesTimer > iFrames / 2 ? 'rgba(255, 50, 50, 0.8)' : 'white';
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, fillStyle);
        fillTriangle(ctx,
            this.pos.x + this.orientation.x * (this.radius + 16), // X Position around Circle
            this.pos.y + this.orientation.y * (this.radius + 16), // Y Position around Circle
            32, 16, this.orientation.angle);
    }

    onCollision(other) {
        if (other instanceof Enemy) {
            if (this.iFramesTimer) return;
            this.hp -= other.damage;
            if (this.hp <= 0) State.requestState(State.death);
            this.iFramesTimer = iFrames;
        }
    }
}