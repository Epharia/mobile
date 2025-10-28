import { Joystick } from "../gfx/ui/joystick.mjs";
import { Handler } from "../handler.mjs";
import { State } from "./State.mjs";

export class StateGame {

    tick() {
        if (Handler.input.keys.pause.pressed) {
            State.setState(State.pause);
        }
        Handler.world.tick();
    }

    render(ctx) {
        Handler.world.render(ctx);
        let move = Handler.touch.moveTouch;
        let aim = Handler.touch.aimTouch;

        if (move) {
            let joystick = new Joystick(move.start);
            joystick.adjust(move.generateDirection());
            joystick.render(ctx);
        }

        if (aim) {
            let joystick = new Joystick(aim.start);
            joystick.adjust(aim.generateDirection());
            joystick.render(ctx);
        }

        //HP
        ctx.fillStyle = 'red';
        ctx.font = "20px Arial";
        ctx.fillText(`${Handler.world.player.hp} HP`, 10, 25);
        ctx.fillStyle = 'gray';
        ctx.font = "15px Arial";
        ctx.fillText(`${Handler.world.score} Points`, 10, 45);
    }
}