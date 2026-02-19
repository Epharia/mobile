import { EventService } from './services/event.mjs';
import { SceneManager } from './services/scene.mjs';
import { Renderer } from './services/renderer.mjs';
import { ResourceManager } from './services/resourceManager.mjs';
import { AnimationService } from './services/animation.mjs';
import { SoundService } from './services/sound.mjs';
import { InputService } from './services/input.mjs';
import { EntityManager } from '../entity/entityManager.mjs';
import { SystemManager } from '../entity/systemManager.mjs';
import { RenderSystem } from '../entity/systems/renderSystem.mjs';
import { ServiceContainer } from './services.mjs';

/**
 * Game engine orchestrating all systems
 */
export class Engine {
    /** @type {Renderer} */ //TODO implement
    renderer;

    /** @type {EventService} */ //TODO implement
    events;

    /** @type {SceneManager} */ //TODO implement
    sceneManager;

    /** @type {ResourceManager} */ //TODO implement
    resources;

    /** @type {AnimationService} */ //TODO implement
    animations;

    /** @type {SoundService} */ //TODO implement
    sound;

    /** @type {InputService} */ //TODO implement
    input;

    /** @type {EntityManager} ECS entity manager */
    entities;

    /** @type {SystemManager} ECS system manager */
    systems;

    /** @type {ServiceContainer} Service registry */
    services;

    /** @type {number} Delta time from last frame */
    deltaTime = 0;

    /** @type {number} Current FPS */
    fps = 0;

    /** @type {boolean} Whether engine is running */
    #running = false;

    /** @type {number} Previous frame time for delta calculation */
    #lastTime = 0;

    constructor(canvas) {
        this.renderer = new Renderer(canvas);
        this.events = new EventService();
        this.sceneManager = new SceneManager();
        this.resources = new ResourceManager();
        this.animations = new AnimationService();
        this.sound = new SoundService();
        this.input = new InputService(this.events);

        this.services = new ServiceContainer();
        this.services.register('renderer', this.renderer);
        this.services.register('events', this.events);
        this.services.register('resources', this.resources);
        this.services.register('animations', this.animations);
        this.services.register('sound', this.sound);
        this.services.register('input', this.input);

        // ECS setup
        // TODO Move entityManager to Scences once implemented 
        this.entities = new EntityManager(this.services);
        this.systems = new SystemManager(this.entities, this.services);
    }

    /**
     * Initialize the engine
     * @returns {Promise<void>}
     */
    async init() {
        console.log('Initializing Engine...');
        this.setCanvasSize(globalThis.innerWidth, globalThis.innerHeight);

        // Wait for any initial resource loading
        await this.resources.waitForLoading();

        console.log('Engine initialized successfully');
    }

    /**
     * Start the engine game loop
     */
    start() {
        if (this.#running) {
            console.warn('Engine is already running');
            return;
        }

        this.#running = true;
        this.#lastTime = 0;
        console.log('Engine started');

        this.#gameLoop(0);
    }

    /**
     * Stop the engine
     */
    stop() {
        this.#running = false;
        console.log('Engine stopped');
    }

    /**
     * Main game loop
     * @param {number} currentTime
     */
    #gameLoop(currentTime) {
        if (!this.#running) return;

        // Calculate delta
        if (this.#lastTime > 0) {
            this.deltaTime = (currentTime - this.#lastTime) / 1000;
            // Cap to prevent spiral of death
            this.deltaTime = Math.min(this.deltaTime, 0.1);
        }

        this.#lastTime = currentTime;
        this.#update();
        this.#render();

        requestAnimationFrame(this.#gameLoop.bind(this));
    }

    /**
     * Update all systems
     */
    #update() {
        // TODO temp testing
        this.entities.update(this.deltaTime);
        this.systems.update(this.deltaTime);
    }

    /**
     * Render via Renderer
     */
    #render() {
        // Clear canvas
        this.renderer.clear('#000000');

        // Render all entities via RenderSystem
        const renderSystem = this.systems.getSystem(RenderSystem);
        if (renderSystem) {
            renderSystem.render();
        }
    }

    /**
     * Get canvas dimensions
     * @returns {{width: number, height: number}}
     */
    getCanvasSize() {
        return this.renderer.getSize();
    }

    /**
     * Set canvas dimensions
     * @param {number} width
     * @param {number} height
     */
    setCanvasSize(width, height) {
        this.renderer.setSize(width, height);
    }

    /**
     * Shutdown engine and clean up all systems
     */
    shutdown() {
        this.stop();
        this.systems.clear();
        this.entities.clear(); //TODO move
        this.sceneManager.clear();
        this.resources.clear();
        this.animations.clear();
        this.sound.clear();
        this.input.destroy();
        this.events.clear();
        console.log('Engine shutdown complete');
    }
}