/**
 * ResourceManager - //TODO add description
 */
export class ResourceManager {
    #resources = new Map();
    #loading = new Map();

    /**
     * Wait for all resources to finish loading
     * @returns {Promise<void>}
     */
    async waitForLoading() {
        await Promise.all(this.#loading.values());
    }
}
