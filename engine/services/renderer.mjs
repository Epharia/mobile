/**
 * Renderer - Canvas rendering wrapper
 */
export class Renderer {
    #canvas;
    #ctx;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');
    }

    /**
     * Get the 2D rendering context
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.#ctx;
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

    /**
     * Draw a filled circle
     * @param {number} x - Center x position
     * @param {number} y - Center y position
     * @param {number} radius
     * @param {string} color - Fill color
     */
    drawCircle(x, y, radius, color) {
        this.#ctx.fillStyle = color;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.#ctx.fill();
    }

    /**
     * Draw a circle outline
     * @param {number} x - Center x position
     * @param {number} y - Center y position
     * @param {number} radius
     * @param {string} color - Stroke color
     * @param {number} lineWidth - Line width
     */
    strokeCircle(x, y, radius, color, lineWidth = 1) {
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.#ctx.stroke();
    }

    /**
     * Draw a filled rectangle
     * @param {number} x - Top-left x position
     * @param {number} y - Top-left y position
     * @param {number} width
     * @param {number} height
     * @param {string} color - Fill color
     */
    drawRect(x, y, width, height, color) {
        this.#ctx.fillStyle = color;
        this.#ctx.fillRect(x, y, width, height);
    }

    /**
     * Draw a rectangle outline
     * @param {number} x - Top-left x position
     * @param {number} y - Top-left y position
     * @param {number} width
     * @param {number} height
     * @param {string} color - Stroke color
     * @param {number} lineWidth - Line width
     */
    strokeRect(x, y, width, height, color, lineWidth = 1) {
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.strokeRect(x, y, width, height);
    }

    /**
     * Draw a line
     * @param {number} x1 - Start x position
     * @param {number} y1 - Start y position
     * @param {number} x2 - End x position
     * @param {number} y2 - End y position
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width
     */
    drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x1, y1);
        this.#ctx.lineTo(x2, y2);
        this.#ctx.stroke();
    }

    /**
     * Draw a polygon
     * @param {Array<{x: number, y: number}>} points - Array of points
     * @param {string} color - Fill color
     * @param {boolean} fill - Whether to fill or stroke
     * @param {number} lineWidth - Line width for stroke
     */
    drawPolygon(points, color, fill = true, lineWidth = 1) {
        if (points.length < 2) return;

        this.#ctx.beginPath();
        this.#ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            this.#ctx.lineTo(points[i].x, points[i].y);
        }

        this.#ctx.closePath();

        if (fill) {
            this.#ctx.fillStyle = color;
            this.#ctx.fill();
        } else {
            this.#ctx.strokeStyle = color;
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.stroke();
        }
    }

    /**
     * Draw text
     * @param {string} text - Text to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Text color
     * @param {string} font - Font specification (e.g., "16px Arial")
     * @param {string} align - Text alignment ("left", "center", "right")
     */
    drawText(text, x, y, color, font = '16px Arial', align = 'left') {
        this.#ctx.fillStyle = color;
        this.#ctx.font = font;
        this.#ctx.textAlign = align;
        this.#ctx.fillText(text, x, y);
    }

    /**
     * Draw an image
     * @param {HTMLImageElement | HTMLCanvasElement} image
     * @param {number} x - Destination x
     * @param {number} y - Destination y
     * @param {number} width - Destination width (optional)
     * @param {number} height - Destination height (optional)
     */
    drawImage(image, x, y, width = null, height = null) {
        if (width !== null && height !== null) {
            this.#ctx.drawImage(image, x, y, width, height);
        } else {
            this.#ctx.drawImage(image, x, y);
        }
    }

    /**
     * Save the current drawing state
     */
    save() {
        this.#ctx.save();
    }

    /**
     * Restore the previous drawing state
     */
    restore() {
        this.#ctx.restore();
    }

    /**
     * Set global alpha (opacity)
     * @param {number} alpha - Alpha value (0-1)
     */
    setAlpha(alpha) {
        this.#ctx.globalAlpha = alpha;
    }

    /**
     * Translate the canvas origin
     * @param {number} x
     * @param {number} y
     */
    translate(x, y) {
        this.#ctx.translate(x, y);
    }

    /**
     * Rotate the canvas
     * @param {number} angle - Angle in radians
     */
    rotate(angle) {
        this.#ctx.rotate(angle);
    }

    /**
     * Scale the canvas
     * @param {number} x - X scale
     * @param {number} y - Y scale
     */
    scale(x, y) {
        this.#ctx.scale(x, y);
    }
}
