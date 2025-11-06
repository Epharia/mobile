import { player, sprite as cfg } from "../../../config.mjs";
import { fillTriangle } from "../../../gfx/gfxLib.mjs";
import { Handler } from "../../../handler.mjs";
import { AiFollow } from "../../ai/tasks/aiFollow.mjs";
import { AiFollowStop } from "../../ai/tasks/aiFollowStop.mjs";
import { AiKeepDistance } from "../../ai/tasks/aiKeepDistance.mjs";
import { AiShoot } from "../../ai/tasks/aiShoot.mjs";
import { Enemy } from "./enemy.mjs";

export class EnemyRanged extends Enemy {
    constructor(x, y, speed = 200) {
        super(x, y, speed, 3)
        this.hp = 3;
        this.color = "#628cffff";

        this.tasks.add(new AiKeepDistance(this), 0);
        this.tasks.add(new AiFollowStop(this), 1);
        this.tasks.add(new AiFollow(this), 2);

        this.tasks.add(new AiShoot(this, cfg.rangedDelay, cfg.rangedDamage, cfg.rangedDelayVariation), 0);
    }

    render(ctx) {
        super.render(ctx);
        const dir = this.pos.copy.sub(Handler.world.player.pos).negate().normalize();
        fillTriangle(ctx,
            this.pos.x + dir.x * (this.radius + (this.radius / 8) + player.gap), // X Position around Circle
            this.pos.y + dir.y * (this.radius + (this.radius / 8) + player.gap), // Y Position around Circle
            this.radius / 2, this.radius / 4, dir.angle, this.color);
    }
}


