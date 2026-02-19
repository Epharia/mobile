/**
 * System - Base class for systems that process entities with specific components
 */
export class System {
    /** @type {boolean} Whether this system is enabled */
    enabled = true;

    /** @type {number} Update priority (lower = earlier execution) */
    priority = 0;

    /** @type {import('../engine/services.mjs').ServiceContainer | null} */
    services = null;

    /** @type {import('./query.mjs').Query[]} Queries created by this system (for cleanup) */
    #queries = [];

    /**
     * Create a new system
     */
    constructor() {

    }

    /**
     * Setup queries for this system
     * Called by SystemManager when system is added
     * Override this to create queries
     * @param {import('./entityManager.mjs').EntityManager} entityManager
     */
    setupQueries(entityManager) {
        // Override in child classes to create queries
    }

    /**
     * Track a query for automatic cleanup
     * @param {import('./query.mjs').Query} query
     * @returns {import('./query.mjs').Query}
     */
    trackQuery(query) {
        this.#queries.push(query);
        return query;
    }

    /**
     * Initialize the system
     * Called once when the system is added, after setupQueries
     * @param {import('../engine/services.mjs').ServiceContainer} services
     */
    init(services) {
        this.services = services;
    }

    /**
     * Update the system
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) { }

    /**
     * Cleanup the system
     * Called when the system is removed
     * Automatically destroys all tracked queries
     */
    cleanup() {
        // Cleanup all queries
        for (const query of this.#queries) {
            query.destroy();
        }
        this.#queries = [];
    }
}
