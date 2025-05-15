import { Trait } from "../Entity.js";

export default class Velocity extends Trait {
	constructor() {
		super("velocity");
	}

	update(parentEntity, deltaTime) {
		parentEntity.pos.x += parentEntity.vel.x * deltaTime;
		parentEntity.pos.y += parentEntity.vel.y * deltaTime;
	}
}
