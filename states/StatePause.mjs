import { Handler } from "../handler.mjs";
import { dialogPause } from "../ui/manager.mjs";
import { State } from "./State.mjs";

export class StatePause {
    tick() {
        if (Handler.keyboard.keys.pause.pressed) {
            State.requestState(State.game);
        }
    }

    onEnter() {
        dialogPause.show();
    }

    onLeave() {
        dialogPause.hide();
    }

    render(ctx) {
        Handler.world.render(ctx);

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}