import { Handler } from "../../handler.mjs";
import { Vector2D } from "../../util/vector2D.mjs";
import { Sprite } from "../sprites/sprite.mjs";
import { AIBase } from "./aiBase.mjs";

const acceleration = 5000;
const startDistance = 100;
const endDistance = 200;

export class AiTestMove extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite) {
        super();
        this.sprite = sprite;
    }

    tick() {
        const direction = this.sprite.pos.copy.sub(Handler.world.player.pos).normalize();
        this.sprite.velocity.addScaled(direction, acceleration * Handler.delta);

    }

    onStart() {
        this.sprite.color = 'rgba(162, 58, 58, 1)';
    }

    get continueExecuting() {
        return this.#distance2 < endDistance * endDistance;
    }

    get shouldExecute() {
        return this.#distance2 < startDistance * startDistance;
    }

    onEnd() {
        this.sprite.velocity = Vector2D.zero;
        this.sprite.color = 'rgba(162, 58, 136, 1)';
    }

    //HELPER
    get #distance2() {
        return this.sprite.pos.copy.sub(Handler.world.player.pos).magnitude2;
    }
}