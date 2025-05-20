import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./EntityCollider.js";

export default class Level {
	constructor() {
		this.gravity = 1200;
		this.totalTime = 0;

		this.comp = new Compositor();
		this.entities = new Set();

		this.tileCollider = null;
		this.entityCollider = new EntityCollider(this.entities);
	}

	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}

	update(deltaTime) {
		// update all entities
		for (const entity of this.entities) {
			entity.update(deltaTime, this);
		}

		// check for entity collisions
		for (const entity of this.entities) {
			this.entityCollider.check(entity);
		}

		// finalize all updating of traits
		for (const entity of this.entities) {
			entity.finalize();
		}

		this.totalTime += deltaTime;
	}
}
