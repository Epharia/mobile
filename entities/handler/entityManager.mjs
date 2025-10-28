export class EntityManager {
    constructor() {
        this.entities = [];
        this.dead = [];
    }

    tick() {
        this.entities.forEach(e => {
            e.tick();
        });

        this.dead.forEach(e => {
            this.remove(e);
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

    destroy(...e) {
        this.dead.push(...e);
    }

    remove(e) {
        const idx = this.entities.indexOf(e);
        if (idx !== -1) this.entities.splice(idx, 1);
    }

    get list() {
        return this.entities;
    }
}