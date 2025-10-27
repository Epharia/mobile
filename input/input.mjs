import { Conf } from "../config.mjs"

export class InputHandler {
    keys = {
        pause: new Key(Conf.BINDS.pause),
        left: new Key(Conf.BINDS.left),
        right: new Key(Conf.BINDS.right),
        up: new Key(Conf.BINDS.up),
        down: new Key(Conf.BINDS.down),
        dash: new Key(Conf.BINDS.dash)
    }

    constructor() {
        window.addEventListener('keydown', e => {
            for (const [key, k] of Object.entries(this.keys)) {
                for (const bind of k.binds)
                    if (bind == e.code) {
                        k.toggle(true);
                    }
            }
        });
        window.addEventListener('keyup', e => {
            for (const [key, k] of Object.entries(this.keys)) {
                for (const bind of k.binds)
                    if (bind == e.code) {
                        k.toggle(false);
                    }
            }
        });
    }
}

class Key {
    constructor(binds) {
        this.binds = binds;
        this.isPressed = false;
        this.typed = false;
    }

    toggle(press) {
        this.isPressed = press;
    }

    get pressed() {
        if (this.isPressed && !this.typed) {
            this.typed = true;
            return true;
        }
        if (!this.isPressed)
            this.typed = false;
        return false;
    }

    get held() {
        return this.isPressed;
    }
}