import { Component } from '../component.mjs';
import { Vector2D } from '../../util/vector2D.mjs';

/**
 * TransformComponent - Handles position, rotation, and scale
 */
export class TransformComponent extends Component {
    /** @type {Vector2D} Position in world space */
    position;

    /** @type {number} Rotation in radians */
    rotation = 0;

    /** @type {Vector2D} Scale (1, 1 = normal size) */
    scale;

    constructor(x = 0, y = 0) {
        super();
        this.position = new Vector2D(x, y);
        this.scale = new Vector2D(1, 1);
    }

    /**
     * Move by offset
     * @param {number} x
     * @param {number} y
     */
    translate(x, y) {
        this.position.x += x;
        this.position.y += y;
    }

    /**
     * Rotate by angle
     * @param {number} angle - Angle in radians
     */
    rotate(angle) {
        this.rotation += angle;
    }
}
