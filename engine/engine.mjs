import { EventSystem } from '../systems/event.mjs';
import { SceneManager } from '../systems/scene.mjs';
import { Renderer } from '../systems/renderer.mjs';
import { ResourceManager } from '../systems/ResourceManager.mjs';
import { AnimationSystem } from '../systems/animation.mjs';
import { SoundSystem } from '../systems/sound.mjs';
import { InputSystem } from '../systems/input.mjs';
import { EntityManager } from '../entity/entityManager.mjs';
import { SystemManager } from '../entity/systemManager.mjs';

/**
 * Game engine orchestrating all systems
 */
export class Engine {
    /** @type {Renderer} */ //TODO implement
    renderer;

    /** @type {EventSystem} */ //TODO implement
    events;

    /** @type {SceneManager} */ //TODO implement
    sceneManager;

    /** @type {ResourceManager} */ //TODO implement
    resources;

    /** @type {AnimationSystem} */ //TODO implement
    animations;

    /** @type {SoundSystem} */ //TODO implement
    sound;

    /** @type {InputSystem} */ //TODO implement
    input;

    /** @type {EntityManager} ECS entity manager */
    entities;

    /** @type {SystemManager} ECS system manager */
    systems;

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
        this.events = new EventSystem();
        this.sceneManager = new SceneManager();
        this.resources = new ResourceManager();
        this.animations = new AnimationSystem();
        this.sound = new SoundSystem();
        this.input = new InputSystem(this.events);

        // ECS setup
        // TODO Move entityManager to Scences once implemented 
        this.entities = new EntityManager();
        this.systems = new SystemManager(this.entities);
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