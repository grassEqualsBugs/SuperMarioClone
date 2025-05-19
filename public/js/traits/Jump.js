import { Trait } from "../Entity.js";

export default class Jump extends Trait {
	constructor() {
		super("jump");

		this.ready = false;
		this.duration = 0.2;
		this.velocity = 250;
		this.engageTime = 0;
	}

	start() {
		if (this.ready) this.engageTime = this.duration;
	}

	cancel() {
		this.engageTime = 0;
	}

	obstruct(entity, side) {
		if (side === "bottom") this.ready = true;
		if (side === "top") this.cancel();
	}

	update(parentEntity, deltaTime) {
		if (this.engageTime > 0) {
			parentEntity.vel.y = -this.velocity;
			this.engageTime -= deltaTime;
		}
		this.ready = false;
	}
}
