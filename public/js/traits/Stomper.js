import { Trait } from "../Entity.js";

export default class Stomper extends Trait {
	constructor() {
		super("stomper");
		this.queueBounce = false;
		this.bounceSpeed = 24000;
	}

	bounce() {
		this.queueBounce = true;
	}

	update(entity, deltaTime) {
		if (this.queueBounce) {
			entity.vel.y = -this.bounceSpeed * deltaTime;
			this.queueBounce = false;
		}
	}
}
