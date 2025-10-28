import { StatePause } from "./StatePause.mjs";
import { StateGame } from "./StateGame.mjs";
import { Handler } from "../handler.mjs";
import { StateDeath } from "./StateDeath.mjs";

export class State {
    static game;
    static pause;
    static current;

    static init() {
        State.game = new StateGame();
        State.pause = new StatePause();
        State.death = new StateDeath();
        State.setState(State.game);
    }

    static setState(next) {
        State.current = next;
    }

    static requestState(state) {
        State.next = state;
    }

    static update() {
        if (State.next == undefined) return;
        State.current = State.next;
        State.next = undefined;
    }

    static tick() {
        State.current.tick();
    }

    static frameCtr = 0;
    static fps = 60;
    static frameTimer = 0;
    static render(ctx) {
        State.current.render(ctx);

        //TEMP (FPS output)
        ++State.frameCtr;
        State.frameTimer += Handler.delta;
        if (State.frameTimer >= 1) {
            State.fps = State.frameCtr;
            State.frameCtr = 0;
            State.frameTimer = Handler.delta;
        }

        ctx.fillStyle = 'white';
        ctx.font = "20px Arial";
        ctx.fillText(State.fps, Handler.canvas.width - 35, 25);
    }
}