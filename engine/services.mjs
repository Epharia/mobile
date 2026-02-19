/**
 * ServiceContainer - Lightweight registry for engine-wide services
 */
export class ServiceContainer {
    #services = new Map();

    /**
     * Register a service instance
     * @param {string} name
     * @param {any} instance
     */
    register(name, instance) {
        this.#services.set(name, instance);
    }

    /**
     * Get a registered service
     * @param {string} name
     * @returns {any}
     */
    get(name) {
        if (!this.#services.has(name)) {
            throw new Error(`Service not found: ${name}`);
        }
        return this.#services.get(name);
    }

    /**
     * Check if a service exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.#services.has(name);
    }
}
