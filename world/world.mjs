import { EntityManager } from "../entities/handler/entityManager.mjs";
import { CollisionHandler } from "../entities/handler/collisionHandler.mjs";
import { Player } from "../entities/sprites/player/player.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { Enemy } from "../entities/sprites/enemy.mjs";

export class World {
    constructor() {
        this.width = 1920;
        this.height = 1080;

        this.entities = new EntityManager();
        this.collisionHandler = new CollisionHandler(this.width, this.height);
    }

    init() {
        this.player = new Player();

        this.entities.add(this.player);

        //TEMP(Delete later)
        // for (let i = 0; i < 10; ++i) {
        //     let pos = Vector2D.random(this.width / 2, this.height).add(Vector2D.right.multiply(this.width / 2));
        //     this.entities.add(new Enemy(pos.x, pos.y, 200 + Math.random() * 100));
        // }
    }

    tick() {
        this.entities.tick();
        this.collisionHandler.process(this.entities.list);
    }

    render(ctx) {
        this.entities.render(ctx);
        // this.collisionHandler.render(ctx);
    }
}