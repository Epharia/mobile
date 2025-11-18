import { State } from "../../states/State.mjs";
import { Dialog } from "./dialog.mjs";
import { button } from "./elements.mjs";

export class DialogMain extends Dialog {
    constructor() {
        super('Circle Suvivor');
        super.addElement(button("Start Game", this.#resume));
        super.addElement(button("Fullscreen", this.#fullscreen));
    }

    #resume() {
        State.requestState(State.game);
    }

    async #fullscreen() {
        try {
            await document.body.requestFullscreen();
        } catch (err) {
            console.error(err.name, err.message);
        }
    }
}