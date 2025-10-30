import { Handler } from "../handler.mjs";
import { Vector2D } from "../util/vector2D.mjs";

export class Entity {
    constructor(x, y) {
        this.alive = true;
        this.pos = new Vector2D(x, y);
    }

    tick() { }
    render(ctx) { }

    destroy() {
        this.alive = false;
        Handler.world.entities.destroy(this);
    }
}