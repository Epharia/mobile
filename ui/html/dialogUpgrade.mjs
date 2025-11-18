import { Handler } from "../../handler.mjs";
import { State } from "../../states/State.mjs";
import { Dialog } from "./dialog.mjs";
import { button } from "./elements.mjs";

export class DialogUpgrade extends Dialog {
    constructor() {
        super('Level UP!');
        this.btnAttSpeed = button("+20% Attack Speed", this.#attackSpeed);
        this.btnDamage = button("+50% Damage", this.#damage);
        this.btnMovSpeed = button("+30% MovementSpeed", this.#speed);
        this.btnProjSize = button("+25% Projectile Speed", this.#projectileSize);
        this.btnPiercing = button("+1 Piercing", this.#piercing);

        super.addElement(this.btnAttSpeed);
        super.addElement(this.btnDamage);
        super.addElement(this.btnMovSpeed);
        super.addElement(this.btnProjSize);
        super.addElement(this.btnPiercing);
    }

    init() {
        this.btnMovSpeed.disabled = false;
        this.btnProjSize.disabled = false;
        this.btnDamage.disabled = false;

        const player = Handler.world.player;
        if (player.upgrades.speed >= 2) this.btnMovSpeed.disabled = true;
        if (player.upgrades.projectileSpeed >= 2) this.btnProjSize.disabled = true;
        if (player.upgrades.damage >= 5) this.btnDamage.disabled = true;
    }

    #attackSpeed() {
        Handler.world.player.upgrades.attackSpeed += .2;
        State.requestState(State.game);
    }

    #damage() {
        Handler.world.player.upgrades.damage += .5;
        State.requestState(State.game);
    }

    #speed() {
        Handler.world.player.upgrades.speed += .3;
        State.requestState(State.game);
    }
    #projectileSize() {
        Handler.world.player.upgrades.projectileSpeed += .25;
        State.requestState(State.game);
    }
    #piercing() {
        Handler.world.player.upgrades.piercing += 1;
        State.requestState(State.game);
    }
}