import { AiFollow } from "../../ai/tasks/aiFollow.mjs";
import { Enemy } from "./enemy.mjs";

export class EnemyMelee extends Enemy {
    constructor(x = 0, y = 0, speed = 300) {
        super(x, y, speed, 2);
        this.color = "#E9B63B";
        this.tasks.add(new AiFollow(this));
    }
}