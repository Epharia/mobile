import { Handler } from "../../../handler.mjs";
import { Enemy } from "../../sprites/enemies/enemy.mjs";
import { AIBase } from "../aiBase.mjs";

export class AiKeepDistance extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite, trigger = 500, target = 600) {
        super();
        this.sprite = sprite;
        this.triggerDist2 = trigger * trigger;
        this.targetDist2 = target * target;
        this.flags = 1;
    }

    tick() {
        const direction = this.#playerVector.normalize();

        //Prevent Converging
        const modifier = Handler.world.densityModifier;
        if (modifier > 0) {
            let enemies = Handler.world.entities.list.filter((e) => e instanceof Enemy);
            if (enemies.length == 0) return;
            for (let e of enemies) {
                const offset = this.sprite.pos.copy.sub(e.pos);
                const distance2 = offset.magnitude2;
                if (distance2 == 0) continue;
                const strength = (5000 / (distance2)) / modifier;
                direction.addScaled(offset.normalize(), strength);
            }
        }

        this.sprite.accelerate(direction);
    }

    get shouldExecute() {
        return this.#playerVector.magnitude2 < this.triggerDist2;
    }

    get shouldContinue() {
        return this.#playerVector.magnitude2 < this.targetDist2;
    }


    //HELPER
    get #playerVector() {
        return this.sprite.pos.copy.sub(Handler.world.player.pos);
    }
}