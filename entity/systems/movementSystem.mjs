import { System } from "../system.mjs";
import { TransformComponent } from "../components/transformComponent.mjs";

export class MovementSystem extends System {
    update(deltaTime) {
        const entities = this.entityManager.getEntitiesWithComponent(TransformComponent);

        for (const entity of entities) {
            const transform = entity.getComponent(TransformComponent);
            transform.translate(1, 0);
        }
    }
}