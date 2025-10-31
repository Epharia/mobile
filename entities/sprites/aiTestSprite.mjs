import { fillCircle } from "../../gfx/gfxLib.mjs";
import { Handler } from "../../handler.mjs";
import { AiTestMove } from "../ai/aiTest.mjs";
import { Sprite } from "./sprite.mjs";

export class AiTestSprite extends Sprite {

    constructor(x = Handler.world.width / 2, y = Handler.world.height / 2) {
        super(x, y);
        this.color = 'rgba(162, 58, 136, 1)';
        this.speed = 700;
        this.tasks.addTask(new AiTestMove(this));
    }

    render(ctx) {
        fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
    }
}