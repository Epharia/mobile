import { sprite as cfg } from "../../../config.mjs";
import { fillCircle } from "../../../gfx/gfxLib.mjs";
import { AiFollow } from "../../ai/tasks/aiFollow.mjs";
import { Enemy } from "./enemy.mjs";
import { AiDash } from "../../ai/tasks/aiDash.mjs";

export class EnemyDash extends Enemy {
    #dashTask = new AiDash(this, cfg.dashDelay, cfg.dashDelayVariation, cfg.dashAnimation, cfg.dashDuration, cfg.dashMultiplier);
    constructor(x, y, speed = 150) {
        super(x, y, speed, 3)
        this.color = "#dd603aff";

        this.tasks.add(new AiFollow(this), 2);
        this.tasks.add(this.#dashTask, 0);
    }

    render(ctx) { 
        super.render(ctx);

        // AI generated, kann bestimmt verbessert werden
        if(this.#dashTask._animationTimer > 0) { 
            // animate fill radius from 0 -> full as the windup timer goes  -> 0
            const animTimer = this.#dashTask._animationTimer;
            const animDuration = Math.max(0.0001, this.#dashTask.animation); // avoid div0
            // progress: 0 when timer == animation (no fill), 1 when timer == 0 (full fill)
            const progress = 1 - Math.max(0, Math.min(1, animTimer / animDuration));
            if (progress > 0) {
                const r = this.radius * progress;
                fillCircle(ctx, this.pos.x, this.pos.y, r, "rgba(255, 0, 0, 1)");
            }
        }
    }
}


