import { DialogPause } from "./html/dialogPause.mjs";

//TODO Add Canvas Based UI system
//TODO Adjust CSS

export const dialogPause = new DialogPause('Test');

export function initHTMLDialogs() {
    if (!globalThis?.document) return;
    const ui = document.getElementById('ui');
    ui.appendChild(dialogPause.container);
}