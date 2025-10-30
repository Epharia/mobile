import { binds } from "../config.mjs"

export class KeyboardHandler {
    keys = {
        pause: new Key(binds.pause),
        left: new Key(binds.left),
        right: new Key(binds.right),
        up: new Key(binds.up),
        down: new Key(binds.down),
        dash: new Key(binds.dash)
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