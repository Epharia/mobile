/**
 * Scene - //TODO add description
 */
export class Scene {
    /** @type {string} Scene identifier */
    id;

    /** @type {Map<string, Entity>} All entities in this scene */
    #entities = new Map();

    /** @type {boolean} Whether scene is active */
    active = true;

    constructor(id = 'scene') {
        this.id = id;
    }
}

/**
 * SceneManager - //TODO add description
 */
export class SceneManager {
    #scenes = new Map();
    #activeScene = null;
    #nextScene = null;
}
