import { fillCircle } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { Entity } from "./entity.mjs";

//If Animations are added, replace this
export class Corpse extends Entity {
    constructor(pos, color) {
        super(pos.x, pos.y);
        this.color = color;
        this.timer = .1;
    }

    tick() {
        if (this.timer > 0) {
            this.timer -= Handler.delta;
            return;
        }
        Handler.world.entities.destroy(this);
    }

    render(ctx) {
        const alpha = this.timer * 5;
        if (alpha < 0 || alpha > 1) return;
        ctx.globalAlpha = alpha;
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
    }
}