import { Vector2D } from "../util/vector2D.mjs";

export class Entity {
    constructor(x, y) {
        this.pos = new Vector2D(x, y);
    }

    tick() { }
    render(ctx) { }
}