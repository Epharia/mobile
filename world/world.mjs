import { EntityManager } from "../entities/handler/entityManager.mjs";
import { CollisionHandler } from "../entities/handler/collisionHandler.mjs";
import { Player } from "../entities/sprites/player/player.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { Enemy } from "../entities/sprites/enemies/enemy.mjs";
import { Handler } from "../handler.mjs";
import { world as cfg, player } from "../config.mjs";
import { EnemyRanged } from "../entities/sprites/enemies/enemyRanged.mjs";
import { EnemyMelee } from "../entities/sprites/enemies/enemyMelee.mjs";

/* TODO Implement Background -> prerendered random tiled canvas???
**  Add Camera
*/

export class World {
    constructor() {
        this.width = cfg.width;
        this.height = cfg.height;
        this.densityModifier = 0;

        this.score = 0;
        this.experience = 0;
        this.wave = 0;

        this.spawnTimer = 3
        this.spawns = 0;
        this.spawnsRanged = 0;
        this.spawnDelay = 0;

        this.calculateScale();

        this.entities = new EntityManager();
        this.collisionHandler = new CollisionHandler(this.width, this.height);
    }

    init() {
        this.player = new Player(player.radius * 2, Handler.height - player.radius * 2);
        this.entities.add(this.player);
    }

    tick() {
        this.#handleSpawn();
        this.entities.tick();
        this.collisionHandler.process(this.entities.list);
    }

    //TODO Refactor
    #handleSpawn() {
        const amount = this.entities.list.filter((e) => e instanceof Enemy).length;
        this.densityModifier = (amount > 1) ? Math.sqrt(this.entities.list.filter((e) => e instanceof Enemy).length) : 1;

        if (amount <= 0 && this.spawns + this.spawnsRanged <= 0) {
            if (this.spawnTimer > 3) this.spawnTimer = 3;
        }

        if (this.spawnTimer > 0) {
            this.spawnTimer -= Handler.delta;
        } else {
            const s = Math.ceil(8 + 4.2 * ++this.wave);
            this.spawns = Math.floor(7 / 8 * s) + 1;
            this.spawnsRanged = Math.floor(1 / 8 * s);
            this.spawnTimer = cfg.spawnDelay;
            this.spawnDelay = 0;
        }

        if (this.spawns + this.spawnsRanged > 0) {
            if (this.spawnDelay > 0) {
                this.spawnDelay -= Handler.delta;
            } else {
                for (let i = 0; i < Math.ceil(Math.random() * this.wave); ++i)
                    this.#spawnRandomEnemy()
                this.spawnDelay = .5 + Math.random();
            }
        }
    }

    #spawnRandomEnemy() {
        let tries = 100;
        while (--tries > 0) {
            const rng = Math.random();
            if (this.spawns > 0 && rng < .7) {
                if (!this.#spawn(new EnemyMelee(0, 0, 200 + Math.random() * 100))) continue;
                --this.spawns;
                tries = 0;
            } else if (this.spawnsRanged > 0) {
                if (!this.#spawn(new EnemyRanged(0, 0, 150 + Math.random() * 50))) continue;
                --this.spawnsRanged;
                tries = 0;
            }
        }
    }

    #spawn(entity) {
        const right = this.player.pos.x < this.width / 2;
        const pos = Vector2D.random(this.width / 2 - 100, this.height);
        if (right) pos.add(Vector2D.right.scale(this.width / 2 + 100));
        if (Number.isNaN(pos.x) || Number.isNaN(pos.y)) return false;
        entity.pos = pos;
        this.entities.add(entity);
        return true;
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
        const scaleX = Handler.canvas.width / this.width;
        const scaleY = Handler.canvas.height / this.height;
        this.scale = Math.min(scaleX, scaleY);

        this.offsetX = (Handler.canvas.width - this.width * this.scale) / 2;
        this.offsetY = (Handler.canvas.height - this.height * this.scale) / 2;
    }
}