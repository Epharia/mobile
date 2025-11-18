import { Player } from "./sprites/player/player.mjs";
import { Handler } from "../handler.mjs";
import { Sprite } from "./sprites/sprite.mjs";
import { fillCircle } from "../gfx/gfxLib.mjs";
import { TaskHandler } from "./ai/taskHandler.mjs";
import { AiFollow } from "./ai/tasks/aiFollow.mjs";
import { Vector2D } from "../util/vector2D.mjs";
import { AiIdle } from "./ai/tasks/aiIdle.mjs";

export class EntityCollectible extends Sprite {

	constructor(x = 0, y = 0, radius = 8, color = 'rgba(85, 165, 38, 1)') {
		super(x, y, radius);
		this.color = color;
		this.radius = radius;

		this.tasks = new TaskHandler();

		this.speed = 600;
		this.acceleration = 7500;
		this.tasks.add(new AiFollow(this, 300), 0);
		this.tasks.add(new AiIdle(this), 1);
	}

	static drop(pos, amount = 1) {
		if (!(pos instanceof Vector2D)) {
			throw new TypeError('EntityCollectible.drop requires a Vector2D as first argument');
		}

		const x = pos.x;
		const y = pos.y;

		for (let i = 0; i < amount; ++i) {

			const ox = (Math.random() - 0.5) * 32;
			const oy = (Math.random() - 0.5) * 32;
			const c = new EntityCollectible(x + ox, y + oy);
			if (Handler?.world?.entities) {
				Handler.world.entities.add(c);
			}
		}
	}

	onCollision(other) {
		if (other instanceof Player) {
			++Handler.world.player.experience;
			this.destroy();
		}
	}

	//TODO replace this with specific collectible logic
	tick() {
		super.tick();
		this.tasks.tick();
	}

	render(ctx) {
		fillCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color, false);
	}

}