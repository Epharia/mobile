export class MouseHandler {
    constructor() {
        this.x = undefined;
        this.y = 0;
        this.isActive = false;

        this.#update = this.#update.bind(this);

        window.addEventListener("mousemove", this.#update, { passive: false });
        window.addEventListener("mouseover", () => this.isActive = true, { passive: true });
        window.addEventListener("mouseout", () => this.isActive = false, { passive: true });
    }

    #update = (event) => {
        event.preventDefault();
        this.x = event.clientX;
        this.y = event.clientY;
    }
}