import { State } from "../../states/State.mjs";
import { Dialog } from "./dialog.mjs";
import { button } from "./elements.mjs";

export class DialogPause extends Dialog {
    constructor() {
        super('Pause', 'pause');
        super.addElement(button("Resume", this.#resume));
        super.addElement(button("Fullscreen", this.#fullscreen));
        this.hide();
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