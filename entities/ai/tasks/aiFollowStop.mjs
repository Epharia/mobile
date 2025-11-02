import { Handler } from "../../../handler.mjs";
import { Sprite } from "../../sprites/sprite.mjs";
import { AIBase } from "../aiBase.mjs";

export class AiFollowStop extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite, distance = 700) {
        super();
        this.sprite = sprite;
        this.targetDist2 = distance * distance;
        this.flags = 1;
    }

    tick() {
        this.sprite.deccelerate();
    }

    get shouldExecute() {
        return this.#distance2 < this.targetDist2;
    }

    //HELPER
    get #distance2() {
        return this.sprite.pos.copy.sub(Handler.world.player.pos).magnitude2;
    }
}