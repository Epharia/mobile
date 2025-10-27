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
    }
}