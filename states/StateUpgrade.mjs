import { Handler } from "../handler.mjs";
import { dialogUpgrade } from "../ui/manager.mjs";

export class StateUpgrade {
    tick() { }

    onEnter() {
        dialogUpgrade.show();
    }

    onLeave() {
        dialogUpgrade.hide();
    }

    render(ctx) {
        Handler.world.render(ctx);

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        Handler.world.player.renderUpgrades(ctx);
    }
}