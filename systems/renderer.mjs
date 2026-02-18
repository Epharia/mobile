/**
 * Renderer - //TODO describe
 */
export class Renderer {
    #canvas;
    #ctx;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');
    }

    /**
     * Get canvas dimensions
     * @returns {{width: number, height: number}}
     */
    getSize() {
        return {
            width: this.#canvas.width,
            height: this.#canvas.height,
        };
    }

    /**
     * Set canvas dimensions
     * @param {number} width
     * @param {number} height
     */
    setSize(width, height) {
        this.#canvas.width = width;
        this.#canvas.height = height;
    }

    /**
     * Clear the entire canvas
     * @param {string} color - Optional fill color
     */
    clear(color = null) {
        if (color) {
            this.#ctx.fillStyle = color;
            this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        } else {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        }
    }
}
