import { sprite as cfg } from '../../config.mjs';
import { Handler } from '../../handler.mjs';
import { Vector2D } from '../../util/vector2D.mjs';
import { TaskHandler } from '../ai/aiTasks.mjs';
import { EntityCollidable } from '../entityCollidable.mjs';

export class Sprite extends EntityCollidable {
    constructor(x = 0, y = 0, radius = 32) {
        super(x, y, radius);
        this.hp = cfg.hp;
        this.speed = cfg.speed;
        this.velocity = Vector2D.zero;
        this.tasks = new TaskHandler();
    }

    tick() {
        this.tasks.tick();
        this.normalizeVelocity();
        this.updatePosition();
    }

    normalizeVelocity(speed = this.speed) {
        if (this.velocity.magnitude2 > speed * speed) {
            this.velocity.normalize().scale(speed);
        }
    }

    updatePosition() {
        this.pos.addScaled(this.velocity, Handler.delta);

        //Bounds
        if (this.pos.y > Handler.world.height - this.radius) {
            this.pos.y = Handler.world.height - this.radius;
            this.velocity.y = 0;
        } else if (this.pos.y - this.radius < 0) {
            this.pos.y = this.radius;
            this.velocity.y = 0;
        }

        if (this.pos.x - this.radius < 0) {
            this.pos.x = this.radius;
            this.velocity.x = 0;
        } else if (this.pos.x > Handler.world.width - this.radius) {
            this.pos.x = Handler.world.width - this.radius;
            this.velocity.x = 0;
        }
    }

    /**
     * @override
     * @param {EntityCollidable} other 
     */
    onCollision(other) { }
}