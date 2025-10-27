import { Handler } from "../handler.mjs";
import { State } from "./State.mjs";

export class StatePause {
    tick() {
        if (Handler.input.keys.pause.pressed) {
            State.setState(State.game);
        }
    }

    render(ctx) {
        Handler.world.render(ctx);

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = "64px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
}