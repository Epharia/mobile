export class EntityManager {
    constructor() {
        this.entities = [];
    }

    tick() {
        this.entities.forEach(e => {
            e.tick();
        });
    }

    render(ctx) {
        this.entities.forEach(e => {
            e.render(ctx);
        });
    }

    add(...e) {
        this.entities.push(...e);
    }

    get list() {
        return this.entities;
    }
}