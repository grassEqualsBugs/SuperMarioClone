import { Trait, Sides } from "../Entity.js";

export default class Jump extends Trait {
	constructor() {
		super("jump");

		this.ready = 0;
		this.duration = 0.2;
		this.velocity = 250;
		this.engageTime = 0;
		this.requestTime = 0;
		this.gracePeriod = 0.1;
		this.speedBoost = 0.3;
	}

	get falling() {
		return this.ready < 0;
	}

	start() {
		this.requestTime = this.gracePeriod;
	}

	cancel() {
		this.engageTime = 0;
		this.requestTime = 0;
	}

	obstruct(entity, side) {
		if (side === Sides.BOTTOM) this.ready = 1;
		if (side === Sides.TOP) this.cancel();
	}

	update(parentEntity, deltaTime) {
		if (this.requestTime > 0) {
			if (this.ready > 0) {
				this.engageTime = this.duration;
				this.requestTime = 0;
			}
			this.requestTime -= deltaTime;
		}
		if (this.engageTime > 0) {
			parentEntity.vel.y = -(
				this.velocity +
				Math.abs(parentEntity.vel.x) * this.speedBoost
			);
			this.engageTime -= deltaTime;
		}
		this.ready--;
	}
}
