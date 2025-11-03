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

        const scale = window.devicePixelRatio;

        //HP
        const width = 500 / scale;
        const thickness = 25 / scale;
        drawHealth(ctx, (canvas.width - width) / 2, 5, width, thickness, Handler.world.player.hp / player.hp);

        //Points
        ctx.fillStyle = 'gray';
        ctx.font = `${20}px Arial`;
        ctx.fillText(`Kills: ${Handler.world.score}`, 10, 25);

        //Timer
        ctx.save();
        ctx.fillStyle = 'gray';
        ctx.font = "15px Arial";
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${Math.ceil(Handler.world.spawnTimer)} s`, 10, Handler.canvas.height - 10);
        ctx.restore();
    }
}