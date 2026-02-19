import { Component } from './component.mjs';
import { EventTypes } from '../engine/services/event.mjs';
/**
 * Entity - Container for components following the Entity Component System pattern
 */
export class Entity {
    /** @type {number} Unique ID */
    id;

    /** @type {string} Optional name/tag */
    name = '';

    /** @type {boolean} */
    active = true;

    /** @type {Map<Function, Component>} Components attached to this entity */
    #components = new Map();

    /** @type {import('../engine/services/event.mjs').EventService | null} */
    #eventSystem = null;

    /** @type {number} Static counter for generating unique IDs */
    static #nextId = 1;

    /**
     * Create a new entity
     * @param {string} name - Optional name
     */
    constructor(name = '') {
        this.id = Entity.#nextId++;
        this.name = name;
    }

    /**
     * @param {import('../engine/services/event.mjs').EventService | null} eventSystem
     */
    setEventSystem(eventSystem) {
        this.#eventSystem = eventSystem;
    }

    /**
     * Add a component to this entity
     * @template {Component} T
     * @param {T} component - Component instance to add
     * @returns {T} The added component
     */
    addComponent(component) {
        if (!(component instanceof Component)) {
            throw new Error('Can only add instances of Component class');
        }

        const ComponentClass = component.constructor;

        if (this.#components.has(ComponentClass)) {
            console.warn(`Entity ${this.name} already has component ${ComponentClass.name}`);
            return this.#components.get(ComponentClass);
        }

        component.entity = this;
        this.#components.set(ComponentClass, component);
        component.onAdd();

        // Emit event
        if (this.#eventSystem) {
            this.#eventSystem.emit(EventTypes.COMPONENT_ADDED, {
                entity: this,
                component,
                componentClass: ComponentClass
            });
        }

        return component;
    }

    /**
     * Remove a component from this entity
     * @param {new(...args: any[]) => Component} ComponentClass
     * @returns {boolean} True if component was removed
     */
    removeComponent(ComponentClass) {
        const component = this.#components.get(ComponentClass);

        if (!component) {
            return false;
        }

        component.onRemove();
        component.entity = null;
        this.#components.delete(ComponentClass);

        // Emit event
        if (this.#eventSystem) {
            this.#eventSystem.emit(EventTypes.COMPONENT_REMOVED, {
                entity: this,
                component,
                componentClass: ComponentClass
            });
        }

        return true;
    }

    /**
     * Get a component by its class
     * @template {Component} T
     * @param {new(...args: any[]) => T} ComponentClass
     * @returns {T | null}
     */
    getComponent(ComponentClass) {
        return this.#components.get(ComponentClass) || null;
    }

    /**
     * Check if entity has a specific component
     * @param {new(...args: any[]) => Component} ComponentClass
     * @returns {boolean}
     */
    hasComponent(ComponentClass) {
        return this.#components.has(ComponentClass);
    }

    /**
     * Get all components attached to this entity
     * @returns {Component[]}
     */
    getComponents() {
        return Array.from(this.#components.values());
    }

    /**
     * Update all active components
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        if (!this.active) return;

        for (const component of this.#components.values()) {
            if (component.enabled && component.update) {
                component.update(deltaTime);
            }
        }
    }

    /**
     * Remove all components and cleanup
     */
    destroy() {
        for (const ComponentClass of this.#components.keys()) {
            this.removeComponent(ComponentClass);
        }
        this.active = false;
    }

    /**
     * Clone this entity with all its components
     * @returns {Entity}
     */
    clone() {
        const clonedEntity = new Entity(this.name);
        clonedEntity.active = this.active;

        for (const component of this.#components.values()) {
            const ComponentClass = component.constructor;
            const clonedComponent = new ComponentClass();

            // Copy over properties (shallow copy)
            Object.assign(clonedComponent, component);
            clonedEntity.addComponent(clonedComponent);
        }

        return clonedEntity;
    }
}