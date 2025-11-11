import { Handler } from "../../../handler.mjs";
import { AIBase } from "../aiBase.mjs";
import { Sprite } from "../../sprites/sprite.mjs";

export class AiDash extends AIBase {
    /**
     * @param {Sprite} sprite 
     */
    constructor(sprite,  delay = 2, variation = 1, animation = 0.5 ,duration = 0.2, multiplier = 10) {
        super();
        this.sprite = sprite;
        this.animation = animation;
        this.delay = delay;
        this.variation = variation;
        this.cooldown = this.dashDelay;

        this.dashDuration = duration;
        this.dashMultiplier = multiplier;

        this._dashTimer = 0;
        this._savedSpeed = null;
        this.direction = null;
    }

    get dashDelay() {
        return this.delay + this.variation * Math.random();
    }

    get shouldExecute() {
        if (this.cooldown > 0) { this.cooldown -= Handler.delta; return false; }
        return true;
    }

    get shouldContinue() {
        return this._dashTimer > 0;
    }

    onStart() {
        this._animationTimer = this.animation;
        this._savedSpeed = this.sprite.speed;
        this._dashTimer = this.dashDuration;
        this.cooldown = this.dashDelay;
        this.direction = this.#playerVector.normalize();
    }

    tick() {
        if (this._animationTimer > 0) {
            this.sprite.speed = 0;

            this._animationTimer -= Handler.delta;
            
            console.log(this._animationTimer);
        }
        
        else if (this._dashTimer > 0) {
            this._dashTimer -= Handler.delta;
            this.sprite.speed = this._savedSpeed * this.dashMultiplier;
            const boost = this.sprite.speed;
            this.sprite.velocity = this.direction.copy.scale(boost);
            
            console.log(this._dashTimer);
        }
    }

    onEnd() {
        if (this._savedSpeed != null) {
            this.sprite.speed = this._savedSpeed;
            this._savedSpeed = null;
        }
        this.cooldown = this.dashDelay;
    }

    //HELPER
    get #playerVector() {
        return Handler.world.player.pos.copy.sub(this.sprite.pos);
    }
}