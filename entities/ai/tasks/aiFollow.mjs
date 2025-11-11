import { Handler } from "../../../handler.mjs";
import { Enemy } from "../../sprites/enemies/enemy.mjs";
import { Sprite } from "../../sprites/sprite.mjs";
import { AIBase } from "../aiBase.mjs";

export class AiFollow extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite, range) {
        super();
        this.range2 = range ? range * range : null;
        if (this.range2) console.log(this.range2)
        this.sprite = sprite;
        this.flags = 1;
    }

    tick() {
        const direction = this.#playerVector.normalize();

        if (this.sprite instanceof Enemy) {
            //Prevent Converging
            const modifier = Handler.world.densityModifier;
            if (modifier > 0) {
                let enemies = Handler.world.entities.list.filter((e) => e instanceof Enemy);
                if (enemies.length === 0) return;
                for (let e of enemies) {
                    const offset = this.sprite.pos.copy.sub(e.pos);
                    const distance2 = offset.magnitude2;
                    if (distance2 === 0) continue;
                    const strength = (5000 / (distance2)) / modifier;
                    direction.addScaled(offset.normalize(), strength);
                }
            }
        }

        this.sprite.accelerate(direction);
    }

    onStart() {
        this.tick();
    }

    get shouldExecute() {
        if (this.range2 === null) return true;
        return this.#playerVector.magnitude2 < this.range2;
    }

    //HELPER
    get #playerVector() {
        return Handler.world.player.pos.copy.sub(this.sprite.pos);
    }
}