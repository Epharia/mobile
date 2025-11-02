import { player as cfg } from "../../../config.mjs";
import { Handler } from "../../../handler.mjs";
import { Projectile } from "../../projectile.mjs";
import { AIBase } from "../aiBase.mjs";

export class AiShoot extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite, delay = 1, damage = 1, variation = 0) {
        super();
        this.sprite = sprite;
        this.delay = delay;
        this.variation = variation;
        this.cooldown = this.attackDelay;
        this.damage = damage;
        this.flags = 2;
    }

    get attackDelay() {
        return this.delay + this.variation * Math.random();
    }

    get shouldExecute() {
        if (this.cooldown > 0) { this.cooldown -= Handler.delta; return false; }
        return true;
    }

    get shouldContinue() {
        return false;
    }

    onStart() {
        const direction = this.#playerVector.normalize();
        const posWeapon = this.sprite.pos.copy.addScaled(direction, (this.sprite.radius + (this.sprite.radius >> 1) + cfg.gap))
        const projectile = new Projectile(this.sprite, direction, this.damage, 1200, posWeapon.x, posWeapon.y);
        Handler.world.entities.add(projectile);
        this.cooldown = this.attackDelay;
    }

    //HELPER
    get #playerVector() {
        return Handler.world.player.pos.copy.sub(this.sprite.pos);
    }
}