import { Handler } from "../../../handler.mjs";
import { Sprite } from "../../sprites/sprite.mjs";
import { AIBase } from "../aiBase.mjs";

export class AiIdle extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite) {
        super();
        this.sprite = sprite;
        this.flags = 3;
    }

    tick() {
        this.sprite.deccelerate();
    }

    get shouldExecute() {
        return true;
    }
}