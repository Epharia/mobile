import { EntityManager } from './entityManager.mjs';

/**
 * System - Base class for systems that process entities with specific components
 * //TODO improve
 * - cache entites? pooling?
 * - component list to fetch only needed entities
 */
export class System {
    /** @type {EntityManager} Reference to the entity manager */
    entityManager; //TODO remove once the rest is done

    /** @type {boolean} Whether this system is enabled */
    enabled = true;

    /** @type {number} Update priority (lower = earlier execution) */
    priority = 0;

    /**
     * Create a new system
     * @param {EntityManager} entityManager
     */
    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Initialize the system
     * Called once when the system is added
     */
    init() { }

    /**
     * Update the system
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) { }

    /**
     * Cleanup the system
     * Called when the system is removed
     */
    cleanup() { }
}
