import { SERVICE_KEYS } from '../engine/services.mjs';

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
     * Get a service from the container
     * @param {string} serviceKey
     * @returns {any}
     */
    getService(serviceKey) {
        if (!this.services) {
            throw new Error('System has no ServiceContainer assigned');
        }

        return this.services.get(serviceKey);
    }

    /**
     * Try to get a service from the container
     * @param {string} serviceKey
     * @returns {any | null}
     */
    tryGetService(serviceKey) {
        if (!this.services) {
            return null;
        }

        return this.services.tryGet(serviceKey);
    }

    /**
     * Check if a service is available
     * @param {string} serviceKey
     * @returns {boolean}
     */
    hasService(serviceKey) {
        return !!this.services && this.services.has(serviceKey);
    }

    /** @returns {import('../engine/services/event.mjs').EventService} */
    get events() {
        return this.getService(SERVICE_KEYS.EVENTS);
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
