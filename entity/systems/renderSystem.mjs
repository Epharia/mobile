import { System } from '../system.mjs';
import { Query } from '../query.mjs';
import { TransformComponent } from '../components/transformComponent.mjs';
import { ShapeComponent } from '../components/shapeComponent.mjs';

/**
 * RenderSystem - describe
 * //TODO improve
 */
export class RenderSystem extends System {
    /** @type {import('../../systems/renderer.mjs').Renderer} Reference to the renderer */
    renderer;

    /** @type {Query} Query for renderable entities */
    #renderables;

    setupQueries(entityManager) {
        this.#renderables = this.trackQuery(
            new Query(entityManager, TransformComponent, ShapeComponent)
        );
    }

    init(services) {
        this.priority = 100;
        this.renderer = services.get('renderer');
    }

    render() {
        const entities = this.#renderables.execute();

        // Sort by z-index (lower first)
        entities.sort((a, b) => {
            const shapeA = a.getComponent(ShapeComponent);
            const shapeB = b.getComponent(ShapeComponent);
            return shapeA.zIndex - shapeB.zIndex;
        });

        for (const entity of entities) {
            this.#renderEntity(entity);
        }
    }

    #renderEntity(entity) {
        const transform = entity.getComponent(TransformComponent);
        const shape = entity.getComponent(ShapeComponent);

        if (!shape.visible) return;

        if (shape.opacity < 1.0) {
            this.renderer.save();
            this.renderer.setAlpha(shape.opacity);
        }

        switch (shape.shapeType) {
            case 'circle':
                this.#renderCircle(transform, shape);
                break;
            case 'rect':
                this.#renderRect(transform, shape);
                break;
            case 'polygon':
                this.#renderPolygon(transform, shape);
                break;
        }

        if (shape.opacity < 1.0) {
            this.renderer.restore();
        }
    }

    /**
     * Render a circle
     * @param {TransformComponent} transform
     * @param {ShapeComponent} shape
     */
    #renderCircle(transform, shape) {
        const x = transform.position.x;
        const y = transform.position.y;
        const radius = shape.radius * Math.max(transform.scale.x, transform.scale.y);

        if (shape.fill) {
            this.renderer.drawCircle(x, y, radius, shape.color);
        }

        if (shape.strokeColor) {
            this.renderer.strokeCircle(x, y, radius, shape.strokeColor, shape.strokeWidth);
        }
    }

    /**
     * Render a rectangle
     * @param {TransformComponent} transform
     * @param {ShapeComponent} shape
     */
    #renderRect(transform, shape) {
        this.renderer.save();

        this.renderer.translate(transform.position.x, transform.position.y);
        this.renderer.rotate(transform.rotation);
        this.renderer.scale(transform.scale.x, transform.scale.y);

        // centered for now
        const x = -shape.width / 2;
        const y = -shape.height / 2;

        if (shape.fill) {
            this.renderer.drawRect(x, y, shape.width, shape.height, shape.color);
        }

        if (shape.strokeColor) {
            this.renderer.strokeRect(x, y, shape.width, shape.height, shape.strokeColor, shape.strokeWidth);
        }

        this.renderer.restore();
    }

    /**
     * Render a polygon
     * @param {TransformComponent} transform
     * @param {ShapeComponent} shape
     */
    #renderPolygon(transform, shape) {
        if (shape.points.length < 3) return;

        this.renderer.save();

        this.renderer.translate(transform.position.x, transform.position.y);
        this.renderer.rotate(transform.rotation);
        this.renderer.scale(transform.scale.x, transform.scale.y);

        const transformedPoints = shape.points.map(p => ({
            x: p.x,
            y: p.y
        }));

        this.renderer.drawPolygon(transformedPoints, shape.color, shape.fill, shape.strokeWidth);

        if (!shape.fill && shape.strokeColor) {
            this.renderer.drawPolygon(transformedPoints, shape.strokeColor, false, shape.strokeWidth);
        }

        this.renderer.restore();
    }
}
