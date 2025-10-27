import { AABB } from "../../util/aabb.mjs";
import { Vector2D } from "../../util/vector2D.mjs";
import { EntityCollidable } from "../entityCollidable.mjs";
import { EntityManager } from "./entityManager.mjs";

const MAX_OBJECTS = 5;
const MAX_LEVELS = 5;

export class CollisionHandler {
    constructor(width, height) {
        this.q = new QuadTree(0, new Bound(0, 0, width, height));
    }

    /**
     * Process collisions using a simple quadtree
     * @param {EntityManager} entities a list of the entities to process
     */
    process(entities) {
        if (entities.length == 0) return;

        this.q.clear();
        let objects = [];

        let i = 0;

        for (let entity of entities) {
            if (!(entity instanceof EntityCollidable)) continue;
            let e = new Entry(entity, i++);
            objects.push(e);
            this.q.insert(e);
        }

        let collisions = [];

        for (let cur of objects) {
            let returnObjects = [];
            this.q.retrieve(returnObjects, cur);

            for (let i = 0; i < returnObjects.length; ++i) {
                let target = returnObjects[i];

                if (cur.s === target.s) continue;
                if (cur.checked[target.id]) continue;

                target.checked[cur.id] = true;
                if (cur.s.checkCollision(target.s)) {
                    collisions.push({ a: cur.s, b: target.s });
                }
            }
        }

        for (let col of collisions) {
            col.a.onCollision(col.b);
            col.b.onCollision(col.a);
        }
    }

    /**
     * render quadtree for testing
     * @deprecated
     * @param {*} ctx 
     */
    render(ctx) {
        this.q.render(ctx);
    }
}

class Entry {
    constructor(sprite, id = 0) {
        this.id = id;

        this.s = sprite;
        let r = sprite.radius;
        this.aabb = new AABB(new Vector2D(-r, -r), new Vector2D(r, r)); //TODO generate AABB from Circle

        this.checked = [];
    }
}

class Bound {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }
}

class QuadTree {
    constructor(level, bounds) {
        this.level = level;
        this.objects = [];
        this.bounds = bounds;
        this.nodes = [];
    }

    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; ++i) {
            if (this.nodes[i] != null) {
                this.nodes[i].clear();
                this.nodes[i] = null;
            }
        }
    }

    split() {
        let subWidth = this.bounds.w / 2;
        let subHeight = this.bounds.h / 2;
        let x = this.bounds.x;
        let y = this.bounds.y;

        //Quadrants I-IV
        this.nodes[0] = new QuadTree(this.level + 1, new Bound(x + subWidth, y, subWidth, subHeight));
        this.nodes[1] = new QuadTree(this.level + 1, new Bound(x, y, subWidth, subHeight));
        this.nodes[2] = new QuadTree(this.level + 1, new Bound(x, y + subHeight, subWidth, subHeight));
        this.nodes[3] = new QuadTree(this.level + 1, new Bound(x + subWidth, y + subHeight, subWidth, subHeight));
    }

    getIndex(entry) {
        let index = -1;
        let vertMid = this.bounds.x + (this.bounds.w / 2);
        let horiMid = this.bounds.y + (this.bounds.h / 2);

        let topQuads = (entry.aabb.y < horiMid && entry.aabb.y + entry.aabb.h < horiMid);
        let botQuads = (entry.aabb.y > horiMid);

        if (entry.aabb.x < vertMid && entry.aabb.x + entry.aabb.w < vertMid) {
            if (topQuads) {
                index = 1;
            } else if (botQuads) {
                index = 2;
            }
        } else if (entry.aabb.x > vertMid) {
            if (topQuads) {
                index = 0;
            } else if (botQuads) {
                index = 3;
            }
        }

        return index;
    }

    insert(entry) {
        if (this.nodes[0] != null) {
            let index = this.getIndex(entry);

            if (index != -1) {
                this.nodes[index].insert(entry);
                return;
            }
        }

        this.objects.push(entry);

        if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS) {
            if (this.nodes[0] == null) {
                this.split();
            }

            let i = 0;
            while (i < this.objects.length) {
                let index = this.getIndex(this.objects[i]);
                if (index != -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    ++i;
                }
            }
        }
    }

    retrieve(returnObjects, entry) {
        let index = this.getIndex(entry);
        if (index != -1 && this.nodes[0] != null) {
            this.nodes[index].retrieve(returnObjects, entry);
        }

        returnObjects.push(...this.objects);
        return returnObjects;
    }

    /**
     * @deprecated
     * TEMP (Delete later!)
     */
    render(ctx) {
        // let alpha = 0.1 + 0.1 * this.level;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 5;
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        for (let node of this.nodes) {
            if (node != null)
                node.render(ctx);
        }
    }
}