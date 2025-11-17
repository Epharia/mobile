import { DialogPause } from "./html/dialogPause.mjs";
import { DialogTest } from "./html/dialogTest.mjs";


//TODO Add Canvas Based UI system

export const dialogPause = new DialogPause();

export function initHTMLDialogs() {
    if (!globalThis?.document) return;
    const ui = document.getElementById('ui');
    ui.appendChild(dialogPause.container);
}