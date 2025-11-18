import { dialogMain } from "../ui/manager.mjs";

const fontSize = 16;
const gap = 4;

export class StateMain {
    tick() {

    }

    onEnter() {
        dialogMain.show();
    }

    onLeave() {
        dialogMain.hide();
    }

    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(`Tap the screen at anytime to pause`, 10, fontSize + gap);
        ctx.fillText(`Left Screen: Move`, 10, 2 * (fontSize + gap));
        ctx.fillText(`Right Screen: Aim`, 10, 3 * (fontSize + gap));
    }
}