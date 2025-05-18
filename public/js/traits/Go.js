import { Trait } from "../Entity.js";

export default class Go extends Trait {
	constructor() {
		super("go");

		this.dir = 0;
		this.speed = 6000;
		this.distance = 0;
		this.heading = 1;
	}

	update(parentEntity, deltaTime) {
		parentEntity.vel.x = this.speed * this.dir * deltaTime;
		if (this.dir) {
			this.heading = this.dir;
			// integrate velocity with respect to time to get total distance
			this.distance += Math.abs(parentEntity.vel.x * deltaTime);
		} else {
			this.distance = 0;
		}
	}
}
