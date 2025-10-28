import { fillCircle } from "../../gfx/gfxLib.mjs";
import { Handler } from "../../handler.mjs";
import { Vector2D } from "../../util/vector2D.mjs";
import { Sprite } from "./sprite.mjs";

export class Enemy extends Sprite {
    constructor(x = 0, y = 0, speed = 400) {
        super(x, y);
        this.speed = speed;
        this.acceleration = 1000;

        this.damage = 5;

        this.direction = new Vector2D();
    }

    tick() {
        this.color = 'black'
        this.updateDirection();
        this.move();
        super.normalizeVelocity(this.speed);
        super.updatePosition();
    }

    move() {
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
            let angle = new Vector2D(this.pos.x, this.pos.y).sub(e.pos);
            let distance2 = angle.magnitude2;
            if (distance2 == 0) continue;
            this.direction.addScaled(angle.normalize(), 1000 / distance2 / (enemies.length / 10));
        }
    }

    render(ctx) {
        super.render(ctx);
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, "rgba(255,100,100)");
    }
}