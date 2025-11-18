import { DialogMain } from "./html/dialogMain.mjs";
import { DialogPause } from "./html/dialogPause.mjs";
import { DialogUpgrade } from "./html/dialogUpgrade.mjs";

//TODO Add Canvas Based UI system

export const dialogPause = new DialogPause();
export const dialogUpgrade = new DialogUpgrade();
export const dialogMain = new DialogMain();

export function initHTMLDialogs() {
    if (!globalThis?.document) return;
    const ui = document.getElementById('ui');
    ui.appendChild(dialogPause.container);
    ui.appendChild(dialogUpgrade.container);
    ui.appendChild(dialogMain.container);
}