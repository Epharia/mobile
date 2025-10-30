import { player } from "../config.mjs";
import { drawHealth } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { State } from "./State.mjs";

export class StateGame {

    tick() {
        if (Handler.keyboard.keys.pause.pressed) {
            State.setState(State.pause);
        }
        Handler.world.tick();
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        Handler.world.render(ctx);

        Handler.touch.joysticks.move.render(ctx);
        Handler.touch.joysticks.aim.render(ctx);

        //HP
        const width = 200;
        const thickness = 20;
        drawHealth(ctx, (canvas.width - width) / 2, 20, width, thickness, Handler.world.player.hp / player.hp);

        //Points
        ctx.fillStyle = 'gray';
        ctx.font = "20px Arial";
        ctx.fillText(`Kills: ${Handler.world.score}`, 10, 25);

        //Timer
        ctx.save();
        ctx.fillStyle = 'gray';
        ctx.font = "15px Arial";
        // ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${Math.ceil(Handler.world.spawnTimer)} s`, 10, Handler.canvas.height - 10);
        ctx.restore();
    }
}