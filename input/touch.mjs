import { Vector2D } from "../util/vector2D.mjs";

export class TouchHandler {
    constructor() {
        this.touches = [];
        window.addEventListener('touchstart', e => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.push(new Touch(touch));
            }
        }, { passive: false });

        window.addEventListener('touchmove', e => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                let t = this.touches.filter(t => t.touch.identifier === touch.identifier)
                if (t.length !== 0) {
                    t.forEach(e => e.update(touch));
                }
            }
        }, { passive: false });

        window.addEventListener('touchend', e => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches = this.touches.filter(t => t.touch.identifier !== touch.identifier);
            }
        }, { passive: false });

        //Prevent "right click" event
        window.addEventListener('contextmenu', e => {
            e.preventDefault();
        })
    }

    get move() {
        if (this.touches.length !== 0) {
            for (let t of this.touches) {
                if (t.start.x < window.innerWidth / 2) {
                    return t.generateInput();
                }
            }
        }
        return Vector2D.zero;
    }

    get aim() {
        if (this.touches.length !== 0) {
            for (let t of this.touches) {
                if (t.start.x > window.innerWidth / 2) {
                    return t.generateInput();
                }
            }
        }
        return Vector2D.zero;
    }
}

class Touch {
    constructor(touch) {
        this.touch = touch;
        this.start = new Vector2D(touch.pageX, touch.pageY);
        this.now = this.start;
    }

    update(touch) {
        this.touch = touch
        this.now = new Vector2D(touch.pageX, touch.pageY);
    }

    generateInput(deadzone = 25) {
        let delta = this.now.copy.sub(this.start);

        if (delta.magnitude2 > deadzone * deadzone) {
            return delta.normalize();
        }
        return Vector2D.zero;
    }
}