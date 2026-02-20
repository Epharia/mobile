import { Entity } from './entity.mjs';
import { Component } from './component.mjs';
import { EventTypes } from '../engine/services/event.mjs';
import { SERVICE_KEYS } from '../engine/services.mjs';

/**
 * EntityManager - Manages all entities in the game
 */
export class EntityManager {
    /** @type {Map<number, Entity>} All entities indexed by ID */
    #entities = new Map();

    /** @type {Map<string, Entity[]>} Entities grouped by name/tag */
    #entitiesByName = new Map();

    /** @type {import('../engine/services.mjs').ServiceContainer | null} Service registry */
    services = null;

    /** @type {import('../engine/services/event.mjs').EventService | null} Event system */
    eventSystem = null;

    /**
     * Create a new entity manager
     * @param {import('../engine/services.mjs').ServiceContainer | null} services
     */
    constructor(services = null) {
        this.services = services;
        if (this.services && this.services.has(SERVICE_KEYS.EVENTS)) {
            this.eventSystem = this.services.get(SERVICE_KEYS.EVENTS);
        }
    }

    /**
     * Create a new entity and add it to the manager
     * @param {string} name - Optional name/tag for the entity
     * @returns {Entity}
     */
    createEntity(name = '') {
        const entity = new Entity(name);
        this.addEntity(entity);
        return entity;
    }

    /**
     * Add an existing entity to the manager
     * @param {Entity} entity
     * @returns {Entity}
     */
    addEntity(entity) {
        entity.setEventSystem(this.eventSystem);

        this.#entities.set(entity.id, entity);

        if (entity.name) {
            if (!this.#entitiesByName.has(entity.name)) {
                this.#entitiesByName.set(entity.name, []);
            }
            this.#entitiesByName.get(entity.name).push(entity);
        }

        if (this.eventSystem) {
            this.eventSystem.emit(EventTypes.ENTITY_ADDED, { entity });
        }

        return entity;
    }

    /**
     * Remove an entity from the manager
     * @param {Entity | number} entity - Entity instance or ID
     * @returns {boolean} True if entity was removed
     */
    removeEntity(entity) {
        const id = typeof entity === 'number' ? entity : entity.id;
        const ent = this.#entities.get(id);

        if (!ent) {
            return false;
        }

        // Remove from name index
        if (ent.name) {
            const nameGroup = this.#entitiesByName.get(ent.name);
            if (nameGroup) {
                const index = nameGroup.indexOf(ent);
                if (index !== -1) {
                    nameGroup.splice(index, 1);
                }
                if (nameGroup.length === 0) {
                    this.#entitiesByName.delete(ent.name);
                }
            }
        }

        ent.destroy();
        this.#entities.delete(id);

        if (this.eventSystem) {
            this.eventSystem.emit(EventTypes.ENTITY_REMOVED, { entity: ent });
        }

        return true;
    }

    /**
     * Get an entity by its ID
     * @param {number} id
     * @returns {Entity | null}
     */
    getEntity(id) {
        return this.#entities.get(id) || null;
    }

    /**
     * Get all entities with a specific name
     * @param {string} name
     * @returns {Entity[]}
     */
    getEntitiesByName(name) {
        return this.#entitiesByName.get(name) || [];
    }

    /**
     * Get the first entity with a specific name
     * @param {string} name
     * @returns {Entity | null}
     */
    findEntityByName(name) {
        const entities = this.#entitiesByName.get(name);
        return entities && entities.length > 0 ? entities[0] : null;
    }

    /**
     * Get all entities that have a specific component
     * @param {new(...args: any[]) => Component} ComponentClass
     * @returns {Entity[]}
     */
    getEntitiesWithComponent(ComponentClass) {
        const result = [];
        for (const entity of this.#entities.values()) {
            if (entity.active && entity.hasComponent(ComponentClass)) {
                result.push(entity);
            }
        }
        return result;
    }

    /**
     * Get all entities that have all of the specified components
     * @param {...(new(...args: any[]) => Component)} ComponentClasses
     * @returns {Entity[]}
     */
    getEntitiesWithComponents(...ComponentClasses) {
        const result = [];
        for (const entity of this.#entities.values()) {
            if (!entity.active) continue;

            const hasAll = ComponentClasses.every(ComponentClass =>
                entity.hasComponent(ComponentClass)
            );

            if (hasAll) {
                result.push(entity);
            }
        }
        return result;
    }

    /**
     * Get all entities
     * @returns {Entity[]}
     */
    getAllEntities() {
        return Array.from(this.#entities.values());
    }

    /**
     * Get all active entities
     * @returns {Entity[]}
     */
    getActiveEntities() {
        return Array.from(this.#entities.values()).filter(e => e.active);
    }

    /**
     * Update all active entities
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        for (const entity of this.#entities.values()) {
            if (entity.active) {
                entity.update(deltaTime);
            }
        }
    }

    /**
     * Remove all entities
     */
    clear() {
        for (const entity of this.#entities.values()) {
            entity.destroy();
        }
        this.#entities.clear();
        this.#entitiesByName.clear();
    }

    /**
     * Get the total count of entities
     * @returns {number}
     */
    getEntityCount() {
        return this.#entities.size;
    }
}
