import { StatePause } from "./StatePause.mjs";
import { StateGame } from "./StateGame.mjs";
import { StateDeath } from "./StateDeath.mjs";
import { StateUpgrade } from "./StateUpgrade.mjs";
import { StateMain } from "./StateMainMenu.mjs";

/* TODO Rework
**  Change Structure
*/

export class State {
    static current;

    static game;
    static pause;
    static death;
    static upgrade;
    static main;

    static init() {
        State.game = new StateGame();
        State.pause = new StatePause();
        State.death = new StateDeath();
        State.upgrade = new StateUpgrade();
        State.main = new StateMain();

        State.requestState(State.main);
        State.update();
    }

    static #setState(next) {
        State.current = next;
    }

    static requestState(state) {
        State.next = state;
    }

    static update() {
        if (State.next == undefined) return;
        if (State.current?.onLeave !== undefined) State.current.onLeave();
        State.current = State.next;
        State.next = undefined;
        if (State.current?.onEnter !== undefined) State.current.onEnter();
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