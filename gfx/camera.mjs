import { Handler } from "../handler.mjs";

export class Camera {
    constructor(xOffset = 0, yOffset = 0) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    centerOnEntity(e) {
        if (e == null) return;
        this.xOffset = e.pos.x + e.radius - Handler.game.width / 2;
        this.yOffset = e.pos.y + e.radius - Handler.game.height / 2;
    }

    checkLimit() {
        if (this.xOffset < 0) {
            this.xOffset = 0;
        } else if (this.xOffset > Handler.width - Handler.canvas.width) {
            this.xOffset = Handler.width - Handler.canvas.width;
        }

        if (this.yOffset < 0) {
            this.yOffset = 0;
        } else if (this.yOffset > Handler.height - Handler.canvas.height) {
            this.yOffset = Handler.height - Handler.canvas.height;
        }
    }

    move(x = 0, y = 0) {
        this.xOffset += x;
        this.yOffset += y;
    }

    get x() {
        return this.xOffset;
    }

    get y() {
        return this.yOffset;
    }
}