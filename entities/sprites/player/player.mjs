import { fillCircle, fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { State } from "../../../states/State.mjs";
import { Vector2D } from "../../../util/vector2D.mjs";
import { Enemy } from "../enemy.mjs";
import { Sprite } from "../sprite.mjs";

export class Player extends Sprite {
    constructor() {
        super(20, Handler.height - 84);

        this.radius = 32;

        this.speed = 500;
        this.acceleration = 7500 + 5000;
        this.friction = 5000;

        this.iFrames = 0;

        this.orientation = Vector2D.right;
    }

    tick() {
        this.color = 'black';
        if (this.iFrames > 0) --this.iFrames;
        this.move();
        super.normalizeVelocity();
        super.updatePosition();
    }

    move() {
        let input = Vector2D.zero;

        if (!Handler.isMobile) {
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
        } else {
            input = Handler.touch.move;
        }

        //Friction with delta
        if (this.velocity.magnitude2 > (this.friction * this.friction) * (Handler.delta * Handler.delta)) {
            this.velocity.addScaled(this.velocity.copy.negate().normalize(), this.friction * Handler.delta);
        } else {
            this.velocity = Vector2D.zero;
        }

        if (!Handler.isMobile) {
            if (!this.velocity.equals(Vector2D.zero)) {
                this.orientation = this.velocity.copy;
                this.orientation.normalize();
            }
        } else {
            let aim = Handler.touch.aim;
            if (!aim.equals(Vector2D.zero)) {
                this.orientation = aim;
            }
        }

        this.velocity.x += input.x * this.acceleration * Handler.delta;
        this.velocity.y += input.y * this.acceleration * Handler.delta;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        super.render(ctx);
        fillCircle(ctx, this.pos.x, this.pos.y);
        fillTriangle(ctx,
            this.pos.x + this.orientation.x * (this.radius + 16), // X Position around Circle
            this.pos.y + this.orientation.y * (this.radius + 16), // Y Position around Circle
            32, 16, this.orientation.angle);
    }

    onCollision(other) {
        if (other instanceof Enemy) {
            if (this.iFrames) return;
            this.hp -= other.damage;
            if (this.hp <= 0) State.requestState(State.death);
            this.iFrames = 10;
            console.log(this.hp);
        }
    }
}