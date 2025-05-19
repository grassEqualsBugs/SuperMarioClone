import { Trait } from "../Entity.js";

export default class Go extends Trait {
	constructor() {
		super("go");

		this.dir = 0;
		this.acceleration = 400;
		this.deceleration = 300;
		this.dragFactor = 1 / 1000;
		this.distance = 0;
		this.heading = 1;
	}

	update(parentEntity, deltaTime) {
		const absX = Math.abs(parentEntity.vel.x);
		if (this.dir !== 0) {
			// integrate acceleration with respect to time to get velocity
			parentEntity.vel.x += this.acceleration * deltaTime * this.dir;
			if (parentEntity.jump) {
				if (!parentEntity.jump.falling) this.heading = this.dir;
			} else {
				this.heading = this.dir;
			}
			// integrate velocity with respect to time to get total distance
		} else if (parentEntity.vel.x !== 0) {
			const decel = Math.min(absX, this.deceleration * deltaTime);
			parentEntity.vel.x += parentEntity.vel.x > 0 ? -decel : decel;
		} else {
			this.distance = 0;
		}

		const drag = this.dragFactor * parentEntity.vel.x * absX;
		parentEntity.vel.x -= drag;

		this.distance += absX * deltaTime;
	}
}
