import { Vector2D } from "./vector2D.mjs";

export class AABB {
    constructor(origin = new Vector2D(), dimensions = new Vector2D(64)) {
        this.origin = origin;
        this.dimensions = dimensions;
    }

    at(position = new Vector2D()) {
        return new AABB(this.origin.copy.add(position), this.dimensions.copy);
    }

    intersects(target = this) {
        return (this.origin.x < target.origin.x + target.dimensions.x &&
            this.origin.x + this.dimensions.x > target.origin.x &&
            this.origin.y < target.origin.y + target.dimensions.y &&
            this.origin.y + this.dimensions.y > target.origin.y);
    }

    get x() {
        return this.origin.x;
    }

    get y() {
        return this.origin.y;
    }

    get w() {
        return this.dimensions.x;
    }

    get h() {
        return this.dimensions.y;
    }
}