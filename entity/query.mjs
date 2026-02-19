import { EntityManager } from './entityManager.mjs';
import { Component } from './component.mjs';
import { EventTypes } from '../engine/services/event.mjs';

/**
 * Query - describe
 */
export class Query {
    /** @type {EntityManager} Reference to entity manager */
    #entityManager;

    /** @type {Array<new(...args: any[]) => Component>} Required components */
    #components;

    /** @type {import('./entity.mjs').Entity[] | null} Cached results */
    #cache = null;

    /** @type {boolean} Whether cache needs refresh */
    #dirty = true;

    /** @type {boolean} Whether to cache results */
    #cacheEnabled = true;

    /** @type {Function[]} Unsubscribe functions for event listeners */
    #unsubscribers = [];

    /**
     * Create a query for entities with specific components
     * @param {EntityManager} entityManager
     * @param {...(new(...args: any[]) => Component)} components
     */
    constructor(entityManager, ...components) {
        this.#entityManager = entityManager;
        this.#components = components;

        // Subscribe to entity/component changes to invalidate cache
        this.#setupEventListeners();
    }

    /**
     * Execute the query and return matching entities
     * @returns {import('./entity.mjs').Entity[]}
     */
    execute() {
        if (this.#cacheEnabled && !this.#dirty && this.#cache) {
            return this.#cache;
        }

        const results = this.#components.length > 0
            ? this.#entityManager.getEntitiesWithComponents(...this.#components)
            : this.#entityManager.getActiveEntities();

        if (this.#cacheEnabled) {
            this.#cache = results;
            this.#dirty = false;
        }

        return results;
    }

    /**
     * Mark cache as dirty
     */
    invalidate() {
        this.#dirty = true;
    }

    /**
     * Enable or disable caching
     * @param {boolean} enabled
     */
    setCacheEnabled(enabled) {
        this.#cacheEnabled = enabled;
        if (!enabled) {
            this.#cache = null;
        }
    }

    /**
     * Get the required components for this query
     * @returns {Array<new(...args: any[]) => Component>}
     */
    getRequiredComponents() {
        return [...this.#components];
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.#cache = null;
        this.#dirty = true;
    }

    /**
     * Setup event listeners for automatic cache invalidation
     */
    #setupEventListeners() {
        const eventSystem = this.#entityManager.eventSystem;
        if (!eventSystem) return;

        // Invalidate when entities are added or removed
        this.#unsubscribers.push(
            eventSystem.subscribe(EventTypes.ENTITY_ADDED, () => this.invalidate())
        );
        this.#unsubscribers.push(
            eventSystem.subscribe(EventTypes.ENTITY_REMOVED, () => this.invalidate())
        );

        // Invalidate when relevant components are added or removed
        this.#unsubscribers.push(
            eventSystem.subscribe(EventTypes.COMPONENT_ADDED, (data) => {
                if (this.#isRelevantComponent(data.componentClass)) {
                    this.invalidate();
                }
            })
        );
        this.#unsubscribers.push(
            eventSystem.subscribe(EventTypes.COMPONENT_REMOVED, (data) => {
                if (this.#isRelevantComponent(data.componentClass)) {
                    this.invalidate();
                }
            })
        );
    }

    /**
     * Check if a component class is relevant to this query
     * @param {new(...args: any[]) => Component} componentClass
     * @returns {boolean}
     */
    #isRelevantComponent(componentClass) {
        // If query has no component requirements, all components are relevant
        if (this.#components.length === 0) return true;

        // Check if the component is one we're querying for
        return this.#components.includes(componentClass);
    }

    /**
     * Get the cached results (for testing/debugging)
     * @returns {import('./entity.mjs').Entity[] | null}
     */
    getCache() {
        return this.#cache;
    }

    /**
     * Check if cache is marked as dirty (for testing/debugging)
     * @returns {boolean}
     */
    isCacheDirty() {
        return this.#dirty;
    }

    /**
     * Cleanup event listeners
     * Call this when the query is no longer needed
     */
    destroy() {
        for (const unsubscribe of this.#unsubscribers) {
            unsubscribe();
        }
        this.#unsubscribers = [];
        this.#cache = null;
    }
}
