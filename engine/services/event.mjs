/**
 * EventService - //TODO description here
 */
export class EventService {
    #listeners = new Map();

    /**
     * Register a listener for an event type
     * @param {string} eventType - The event type to listen for
     * @param {Function} callback - Function to call when event fires
     * @returns {Function} Unsubscribe function
     */
    subscribe(eventType, callback) {
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }

        this.#listeners.get(eventType).push(callback);

        // Return unsubscribe function
        return () => {
            const listeners = this.#listeners.get(eventType);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    /**
     * Remove all listeners for an event type
     * @param {string} eventType - The event type to clear
     */
    unsubscribeAll(eventType) {
        if (this.#listeners.has(eventType)) {
            this.#listeners.delete(eventType);
        }
    }

    /**
     * Emit an event to all listeners
     * @param {string} eventType - The event type to emit
     * @param {any} data - Data to pass to listeners
     */
    emit(eventType, data = null) {
        if (!this.#listeners.has(eventType)) {
            return;
        }

        const listeners = this.#listeners.get(eventType);
        // Copy array in case listeners unsubscribe during iteration
        for (const listener of [...listeners]) {
            listener(data);
        }
    }

    /**
     * Clear all listeners
     */
    clear() {
        this.#listeners.clear();
    }
}

//TODO Predefined event types
export const EventTypes = {
    // Wave/Game events
    WAVE_STARTED: 'wave:started',
    WAVE_COMPLETED: 'wave:completed',
    WAVE_FAILED: 'wave:failed',

    // ECS Entity events
    ENTITY_ADDED: 'ecs:entity:added',
    ENTITY_REMOVED: 'ecs:entity:removed',

    // ECS Component events
    COMPONENT_ADDED: 'ecs:component:added',
    COMPONENT_REMOVED: 'ecs:component:removed',
};
