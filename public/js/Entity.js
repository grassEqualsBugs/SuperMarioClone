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
		this.tasks = [];
	}

	finalize() {
		for (const task of this.tasks) task();
		this.tasks.length = 0;
	}

	queue(task) {
		this.tasks.push(task);
	}

	collides(us, them) {}
	obstruct() {}
	update() {}
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

	collides(candidate) {
		for (const trait of this.traits) {
			trait.collides(this, candidate);
		}
	}

	obstruct(side, match) {
		for (const trait of this.traits) {
			trait.obstruct(this, side, match);
		}
	}

	update(deltaTime, level) {
		for (const trait of this.traits) {
			trait.update(this, deltaTime, level);
		}
		this.lifetime += deltaTime;
	}

	finalize() {
		for (const trait of this.traits) {
			trait.finalize();
		}
	}

	draw(context) {}
}
