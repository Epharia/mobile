/**
 * Component - Base class for all components
 */
export class Component {
    /** @type {import('./entity.mjs').Entity} Reference to the entity this component is attached to */
    entity = null;

    /** @type {boolean} Whether this component is active and should be updated */
    enabled = true;

    /**
     * Called when component is added to an entity
     * Override this to initialize component state
     */
    onAdd() { }

    /**
     * Called when component is removed from an entity
     * Override this to cleanup component resources
     */
    onRemove() { }

    /**
     * //TODO find a better solution for those components with update
     * Called every frame
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) { }

    /**
     * Get another component from the same entity
     * @template {Component} T
     * @param {new(...args: any[]) => T} ComponentClass
     * @returns {T | null}
     */
    getComponent(ComponentClass) {
        return this.entity ? this.entity.getComponent(ComponentClass) : null;
    }

    /**
     * Check if entity has a specific component
     * @param {new(...args: any[]) => Component} ComponentClass
     * @returns {boolean}
     */
    hasComponent(ComponentClass) {
        return this.entity ? this.entity.hasComponent(ComponentClass) : false;
    }
}