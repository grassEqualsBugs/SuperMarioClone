import { Trait } from "../Entity.js";

export default class Jump extends Trait {
	constructor() {
		super("jump");

		this.duration = 0.2;
		this.velocity = 250;
		this.engageTime = 0;
	}

	start() {
		this.engageTime = this.duration;
	}

	cancel() {
		this.engageTime = 0;
	}

	update(parentEntity, deltaTime) {
		if (this.engageTime > 0) {
			parentEntity.vel.y = -this.velocity;
			this.engageTime -= deltaTime;
		}
	}
}
