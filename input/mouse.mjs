export class MouseHandler {
    constructor() {
        this.x = undefined;
        this.y = 0;
        this.isActive = false;

        this.#update = this.#update.bind(this);

        globalThis.addEventListener("mousemove", this.#update, { passive: false });
        globalThis.addEventListener("mouseover", () => this.isActive = true, { passive: true });
        globalThis.addEventListener("mouseout", () => this.isActive = false, { passive: true });
    }

    #update = (event) => {
        event.preventDefault();
        this.x = event.clientX;
        this.y = event.clientY;
    }
}