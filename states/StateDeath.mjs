import { Handler } from "../handler.mjs";
import { World } from "../world/world.mjs";
import { State } from "./State.mjs";

export class StateDeath {

    tick() {
        if (Handler.input.keys.pause.pressed) {
            Handler.world = new World();
            Handler.world.init();
            State.setState(State.game);
        }
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = "16em Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = 'rgba(255, 0, 0, 0.6)';
        ctx.shadowBlur = 16;
        ctx.fillText("You Died!", canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
}