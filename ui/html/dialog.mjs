import { header } from "./elements.mjs";

export class Dialog {
    visible = false;

    constructor(title = '', ...classList) {
        this.container = globalThis.document.createElement('div');
        this.container.classList.add('dialog', 'glassy', ...classList);

        if (title.length > 0) {
            const e = header(title);
            this.addElement(e);
        }

        this.hide();
    }

    addElement(element) {
        this.container.appendChild(element);
    }

    init() {

    }

    show() {
        this.init();
        this.container.style.opacity = 1;
        this.container.style.visibility = 'visible';
        this.visible = true;
    }

    hide() {
        this.container.style.opacity = 0;
        this.container.style.visibility = 'hidden';
        this.visible = false;
    }
}