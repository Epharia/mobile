import { Handler } from "../handler.mjs";
import { World } from "../world/world.mjs";
import { State } from "./State.mjs";

export class StateDeath {
    static timer = 5;
    tick() {
        StateDeath.timer -= Handler.delta;
        if (Handler.input.keys.pause.pressed || StateDeath.timer <= 0) {
            StateDeath.timer = 5;
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
        ctx.fillText('You Died!', canvas.width / 2, canvas.height / 2 - 100);
        ctx.fillText(`Respawn in ${Math.ceil(StateDeath.timer)}`, canvas.width / 2, canvas.height / 2 + 200);
        ctx.restore();
    }
}