import { Component } from '../component.mjs';

/**
 * ShapeComponent - Renders basic geometric shapes (circle, rect, polygon)
 */
export class ShapeComponent extends Component {
    /** @type {string} Shape type: 'circle', 'rect', 'polygon' */
    shapeType = 'circle';

    /** @type {number} Radius (for circle) */
    radius = 10;

    /** @type {number} Width (for rect) */
    width = 20;

    /** @type {number} Height (for rect) */
    height = 20;

    /** @type {Array<{x: number, y: number}>} Points for polygon (relative to entity position) */
    points = [];

    /** @type {string} Fill color */
    color = '#ffffff';

    /** @type {string | null} Stroke color (null = no stroke) */
    strokeColor = null;

    /** @type {number} Stroke width */
    strokeWidth = 1;

    /** @type {boolean} Whether to fill the shape */
    fill = true;

    /** @type {boolean} Whether this shape is visible */
    visible = true;

    /** @type {number} Render order (higher = rendered last/on top) */
    zIndex = 0;

    /** @type {number} Opacity (0-1) */
    opacity = 1.0;

    /**
     * Create a circle
     * @param {number} radius
     * @param {string} color
     * @returns {ShapeComponent}
     */
    static circle(radius = 10, color = '#ffffff') {
        const shape = new ShapeComponent();
        shape.shapeType = 'circle';
        shape.radius = radius;
        shape.color = color;
        return shape;
    }

    /**
     * Create a rectangle
     * @param {number} width
     * @param {number} height
     * @param {string} color
     * @returns {ShapeComponent}
     */
    static rect(width = 20, height = 20, color = '#ffffff') {
        const shape = new ShapeComponent();
        shape.shapeType = 'rect';
        shape.width = width;
        shape.height = height;
        shape.color = color;
        return shape;
    }

    /**
     * Create a polygon
     * @param {Array<{x: number, y: number}>} points
     * @param {string} color
     * @returns {ShapeComponent}
     */
    static polygon(points, color = '#ffffff') {
        const shape = new ShapeComponent();
        shape.shapeType = 'polygon';
        shape.points = points;
        shape.color = color;
        return shape;
    }
}
