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
        ctx.fillStyle = 'red';
        ctx.font = "20px Arial";
        ctx.fillText(`${Math.max(0, Handler.world.player.hp)} HP`, 10, 25);

        //Points
        ctx.fillStyle = 'gray';
        ctx.font = "15px Arial";
        ctx.fillText(`${Handler.world.score} Points`, 10, 45);

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