import { StatePause } from "./StatePause.mjs";
import { StateGame } from "./StateGame.mjs";
import { StateDeath } from "./StateDeath.mjs";

/* TODO Rework
**  Change Structure
*/

export class State {
    static game;
    static pause;
    static current;
    static death;

    static init() {
        State.game = new StateGame();
        State.pause = new StatePause();
        State.death = new StateDeath();
        State.#setState(State.game);
    }

    static #setState(next) {
        State.current = next;
    }

    static requestState(state) {
        State.next = state;
    }

    static update() {
        if (State.next == undefined) return;
        if (State.current.onLeave) State.current.onLeave();
        State.current = State.next;
        State.next = undefined;
        if (State.current.onEnter) State.current.onEnter();
    }

    static tick() {
        State.current.tick();
    }

    static frameCtr = 0;
    static fps = 60;
    static frameTimer = 0;
    static render(ctx) {
        State.current.render(ctx);
    }
}