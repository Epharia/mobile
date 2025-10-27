import { Handler } from "../../handler.mjs";
import { Vector2D } from "../../util/vector2D.mjs";
import { fillCircle } from "../gfxLib.mjs";

export class Joystick {
    constructor(pos = new Vector2D.zero, radius = 32) {
        this.pos = pos;
        this.knob = Vector2D.zero;
        this.radius = radius;
    }

    adjust(v = new Vector2D.zero) {
        this.knob = v;
    }

    render(ctx) {
        let canvas = Handler.canvas;
        let bx = canvas.getBoundingClientRect();
        let pos = this.pos.copy.sub(new Vector2D(bx.left, bx.top));
        pos.x = Math.floor((pos.x / canvas.scrollWidth) * canvas.width);
        pos.y = Math.floor((pos.y / canvas.scrollHeight) * canvas.height);
        fillCircle(ctx, pos.x + this.knob.x, pos.y + this.knob.y, this.radius, 'rgba(164, 164, 164, 0.2)');
        fillCircle(ctx, pos.x, pos.y, this.radius / 2, 'rgba(164, 164, 164, 0.2)');
    }
}