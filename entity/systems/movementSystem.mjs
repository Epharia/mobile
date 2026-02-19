import { System } from "../system.mjs";
import { Query } from "../query.mjs";
import { TransformComponent } from "../components/transformComponent.mjs";

//TODO implement correctly
export class MovementSystem extends System {
    /** @type {Query} Query for movable entities */
    #movables;

    setupQueries(entityManager) {
        this.#movables = this.trackQuery(
            new Query(entityManager, TransformComponent)
        );
    }

    update(deltaTime) {
        for (const entity of this.#movables.execute()) {
            const transform = entity.getComponent(TransformComponent);
            transform.translate(50 * deltaTime, 0);
        }
    }
}