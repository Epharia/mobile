import { fillCircle } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { Entity } from "./entity.mjs";

const animationTime = .2;

//If Animations are added, replace this
export class Corpse extends Entity {
    constructor(pos, color, radius = 32) {
        super(pos.x, pos.y);
        this.color = color;
        this.timer = animationTime;
        this.radius = radius;
    }

    tick() {
        if (this.timer > 0) {
            this.timer -= Handler.delta;
            return;
        }
        Handler.world.entities.destroy(this);
    }

    render(ctx) {
        ctx.save();
        const alpha = this.timer / animationTime;
        if (alpha > 0 && alpha < 1) {
            ctx.globalAlpha = alpha;
        }
        const radius = this.timer > 0 ? (this.timer / animationTime) * this.radius : 0;
        if (radius > 0) fillCircle(ctx, this.pos.x, this.pos.y, radius, this.color);
        ctx.restore();
    }
}