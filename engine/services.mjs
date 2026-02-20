/**
 * ServiceContainer - Lightweight registry for engine-wide services
 */
export const SERVICE_KEYS = Object.freeze({
    RENDERER: 'renderer',
    EVENTS: 'events',
    SCENE_MANAGER: 'sceneManager',
    RESOURCES: 'resources',
    ANIMATIONS: 'animations',
    SOUND: 'sound',
    INPUT: 'input',
});

export class ServiceContainer {
    #services = new Map();

    /**
     * Register a service instance
     * @param {string} name
     * @param {any} instance
     * @param {{ override?: boolean }} options
     */
    register(name, instance, options = {}) {
        const { override = false } = options;

        if (this.#services.has(name) && !override) {
            throw new Error(`Service already registered: ${name}`);
        }

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
     * Try to get a registered service
     * @param {string} name
     * @returns {any | null}
     */
    tryGet(name) {
        return this.#services.get(name) ?? null;
    }

    /**
     * Check if a service exists
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.#services.has(name);
    }

    /**
     * Remove a registered service
     * @param {string} name
     * @returns {boolean}
     */
    unregister(name) {
        return this.#services.delete(name);
    }

    /**
     * Remove all registered services
     */
    clear() {
        this.#services.clear();
    }
}
