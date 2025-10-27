import { EntityManager } from "../entities/handler/entityManager.mjs";
import { CollisionHandler } from "../entities/handler/collisionHandler.mjs";
import { Player } from "../entities/sprites/player/player.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { Enemy } from "../entities/sprites/enemy.mjs";
import { Handler } from "../handler.mjs";

const width = 2000;
const height = 1000;

export class World {
    constructor() {
        this.width = width;
        this.height = height;

        this.calculateScale();

        this.entities = new EntityManager();
        this.collisionHandler = new CollisionHandler(this.width, this.height);
    }

    init() {
        this.player = new Player();

        this.entities.add(this.player);

        //TEMP(Delete later)
        for (let i = 0; i < 10; ++i) {
            let pos = Vector2D.random(this.width / 2, this.height).add(Vector2D.right.multiply(this.width / 2));
            this.entities.add(new Enemy(pos.x, pos.y, 200 + Math.random() * 100));
        }
    }

    tick() {
        this.entities.tick();
        this.collisionHandler.process(this.entities.list);
    }

    /**
     * renders the world and its entities
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        ctx.save();
        ctx.translate(this.offsetX, this.offsetY);
        ctx.scale(this.scale, this.scale);
        ctx.fillStyle = 'rgba(25, 25, 30, 1)'
        ctx.fillRect(0, 0, this.width, this.height);
        this.entities.render(ctx);
        ctx.restore();
    }

    calculateScale() {
        let scaleX = Handler.canvas.width / this.width;
        let scaleY = Handler.canvas.height / this.height;
        this.scale = Math.min(scaleX, scaleY);

        this.offsetX = (Handler.canvas.width - this.width * this.scale) / 2;
        this.offsetY = (Handler.canvas.height - this.height * this.scale) / 2;
    }
}