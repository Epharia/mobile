import { System } from './system.mjs';
import { EntityManager } from './entityManager.mjs';

/**
 * SystemManager - Manages ECS systems
 */
export class SystemManager {
    /** @type {EntityManager} Reference to the entity manager */
    entityManager;

    /** @type {import('../engine/services.mjs').ServiceContainer} Service registry */
    services;

    /** @type {System[]} All registered systems */
    #systems = [];

    //TODO is this is really needed? decide once the project has grown a bit
    /** @type {Map<new(...args: any[]) => System, System>} Systems indexed by class for quick lookup */
    #systemsByClass = new Map();

    /**
     * Create a new system manager
     * @param {EntityManager} entityManager
     * @param {import('../engine/services.mjs').ServiceContainer} services
     */
    constructor(entityManager, services) {
        this.entityManager = entityManager;
        this.services = services;
    }

    /**
     * Register a system
     * @template {System} T
     * @param {T} system - System instance to register
     * @returns {T} The registered system
     */
    addSystem(system) {
        if (!(system instanceof System)) {
            throw new Error('Can only add instances of System class');
        }

        const SystemClass = system.constructor;

        if (this.#systemsByClass.has(SystemClass)) {
            console.warn(`System ${SystemClass.name} is already registered`);
            return this.#systemsByClass.get(SystemClass);
        }

        this.#systems.push(system);
        this.#systemsByClass.set(SystemClass, system);

        // Sort by priority (lower = earlier)
        this.#systems.sort((a, b) => a.priority - b.priority);

        system.setupQueries(this.entityManager);
        system.services = this.services;
        system.init(this.services);

        return system;
    }

    /**
     * Remove a system
     * @param {(new(...args: any[]) => System) | System} system - System class or instance
     * @returns {boolean} True if system was removed
     */
    removeSystem(system) {
        const SystemClass = typeof system === 'function'
            ? system
            : system.constructor;

        const sys = this.#systemsByClass.get(SystemClass);

        if (!sys) {
            return false;
        }

        sys.cleanup();

        const index = this.#systems.indexOf(sys);
        if (index !== -1) {
            this.#systems.splice(index, 1);
        }

        this.#systemsByClass.delete(SystemClass);
        return true;
    }

    /**
     * Get a system by its class
     * @template {System} T
     * @param {new(...args: any[]) => T} SystemClass
     * @returns {T | null}
     */
    getSystem(SystemClass) {
        return this.#systemsByClass.get(SystemClass) || null;
    }

    /**
     * Check if a system is registered
     * @param {new(...args: any[]) => System} SystemClass
     * @returns {boolean}
     */
    hasSystem(SystemClass) {
        return this.#systemsByClass.has(SystemClass);
    }

    /**
     * Get all registered systems
     * @returns {System[]}
     */
    getAllSystems() {
        return [...this.#systems];
    }

    /**
     * Update all enabled systems
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        for (const system of this.#systems) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }
    }

    /**
     * Remove all systems
     */
    clear() {
        for (const system of this.#systems) {
            system.cleanup();
        }
        this.#systems = [];
        this.#systemsByClass.clear();
    }

    /**
     * Get the count of registered systems
     * @returns {number}
     */
    getSystemCount() {
        return this.#systems.length;
    }
}
