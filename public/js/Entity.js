import { Vec2 } from "./math.js";
import BoundingBox from "./BoundingBox.js";

export const Sides = {
	TOP: Symbol("top"),
	BOTTOM: Symbol("bottom"),
	LEFT: Symbol("left"),
	RIGHT: Symbol("right"),
};

export class Trait {
	constructor(name) {
		this.NAME = name;
	}

	obstruct() {}

	update() {
		console.warn("Unhandled update call in Trait");
	}
}

export default class Entity {
	constructor() {
		this.pos = new Vec2(0, 0);
		this.vel = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
		this.collisionOffset = new Vec2(0, 0);
		this.bounds = new BoundingBox(
			this.pos,
			this.size,
			this.collisionOffset,
		);

		this.traits = [];

		this.lifetime = 0;
	}

	addTrait(trait) {
		this.traits.push(trait);
		this[trait.NAME] = trait;
	}

	obstruct(side) {
		for (const trait of this.traits) {
			trait.obstruct(this, side);
		}
	}

	update(deltaTime) {
		for (const trait of this.traits) {
			trait.update(this, deltaTime);
		}
		this.lifetime += deltaTime;
	}
}
