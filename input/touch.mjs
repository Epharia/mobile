import { input as cfg } from "../config.mjs";
import { fillCircle } from "../gfx/gfxLib.mjs";
import { Handler } from "../handler.mjs";
import { Vector2D } from "../util/vector2D.mjs";

export class TouchHandler {
    joysticks = {
        move: new Joystick("left"),
        aim: new Joystick("right")
    }

    /** @type {Map<Number, Touch>} */
    #touches = new Map();
    #lastTap;

    get tapped() {
        const tap = this.#lastTap;
        this.#lastTap = undefined;
        return tap ? (tap.ended && tap.wasTap) : false;
    }

    constructor() {
        this._onStart = this._onStart.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onContextMenu = this._onContextMenu.bind(this);

        globalThis.addEventListener("touchstart", this._onStart, { passive: false });
        globalThis.addEventListener("touchmove", this._onMove, { passive: false });
        globalThis.addEventListener("touchend", this._onEnd, { passive: false });
        globalThis.addEventListener("touchcancel", this._onCancel, { passive: false });
        globalThis.addEventListener("contextmenu", this._onContextMenu, { passive: false });
    }

    _findTouch(predicate) {
        for (const t of this.#touches.values()) {
            if (predicate(t)) return t;
        }
        return undefined;
    }

    _onStart(event) {
        event.preventDefault();
        for (const t of event.changedTouches) {
            this.#touches.set(t.identifier, new Touch(t));
        }
    }

    _onMove(event) {
        event.preventDefault();
        for (const t of event.changedTouches) {
            const wrapper = this.#touches.get(t.identifier);
            if (wrapper) wrapper.update(t);
        }
    }

    _onEnd(event) {
        event.preventDefault();
        for (const t of event.changedTouches) {
            const wrapper = this.#touches.get(t.identifier);
            if (wrapper) {
                wrapper.end();
                this.#touches.delete(t.identifier);
                if (wrapper.wasTap) {
                    this.#lastTap = wrapper;
                }
            }
        }
    }

    _onCancel(event) {
        event.preventDefault();
        for (const t of event.changedTouches) {
            this.#touches.delete(t.identifier);
        }
    }

    _onContextMenu(event) {
        //Prevent Context Menu
        event.preventDefault();
    }

    destroy() {
        globalThis.removeEventListener("touchstart", this._onStart);
        globalThis.removeEventListener("touchmove", this._onMove);
        globalThis.removeEventListener("touchend", this._onEnd);
        globalThis.removeEventListener("touchcancel", this._onCancel);
        globalThis.removeEventListener("contextmenu", this._onContextMenu);
        this.#touches.clear();
    }
}

class Touch {
    constructor(event) {
        this.start = new Vector2D(event.clientX, event.clientY);
        this.current = new Vector2D(event.clientX, event.clientY);

        this.startTime = performance.now();
        this.ended = false;
        this.wasTap = false;
    }

    get tapped() {
        return this.ended && this.wasTap;
    }

    update(event) {
        this.current = new Vector2D(event.clientX, event.clientY);
    }

    end() {
        const delta = performance.now() - this.startTime;
        const d2 = this.current.copy.sub(this.start).magnitude2;
        this.wasTap = delta < cfg.tapTime && d2 < cfg.tapDistance;
        this.ended = true;
    }
}

class Joystick {
    constructor(side) {
        this.side = side;
        this.deadzone2 = cfg.deadzone * cfg.deadzone;
        this.maxOffset = cfg.maxOffset;
        this.radius = cfg.radius;
    }

    get _touch() {
        const half = window.innerWidth / 2;
        return Handler.touch._findTouch(t =>
            this.side === "right" ? t.start.x > half : t.start.x <= half
        );
    }

    get center() {
        const t = this._touch;
        return t ? t.start : null;
    }

    get knob() {
        const t = this._touch;
        if (!t) return Vector2D.zero;
        const d = t.current.copy.sub(t.start);
        const max2 = this.maxOffset * this.maxOffset;
        if (d.magnitude2 > max2) return d.normalize().scale(this.maxOffset);
        return d;
    }

    get input() {
        const k = this.knob;
        if (k.magnitude2 <= this.deadzone2) return Vector2D.zero;
        if (k === Vector2D.zero) return Vector2D.zero;
        return k.copy.scale(1 / this.maxOffset);
    }

    render(ctx) {
        const t = this._touch;
        if (!t) return;

        const canvas = Handler.canvas;
        const bx = canvas.getBoundingClientRect();

        const pos = t.start.copy.sub(new Vector2D(bx.left, bx.top));
        pos.x = Math.floor((pos.x / canvas.scrollWidth) * canvas.width);
        pos.y = Math.floor((pos.y / canvas.scrollHeight) * canvas.height);

        const k = this.knob;
        const kx = (k.x / canvas.scrollWidth) * canvas.width;
        const ky = (k.y / canvas.scrollHeight) * canvas.height;

        fillCircle(ctx, pos.x + kx, pos.y + ky, this.radius, 'rgba(164, 164, 164, 0.2)');
        fillCircle(ctx, pos.x, pos.y, this.maxOffset + this.radius, 'rgba(164, 164, 164, 0.2)');
    }
}