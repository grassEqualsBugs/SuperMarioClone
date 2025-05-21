import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./EntityCollider.js";

export default class Level {
	constructor() {
		this.gravity = 1200;
		this.totalTime = 0;

		this.comp = new Compositor();
		this.entities = new Set();

		this.camera = null;
		this.tileCollider = null;
		this.entityCollider = new EntityCollider(this.entities);
	}

	setCamera(camera) {
		this.camera = camera;
	}

	setCollisionGrid(matrix) {
		this.tileCollider = new TileCollider(matrix);
	}

	update(deltaTime) {
		// activate entities that are in the camera
		for (const entity of this.entities) {
			if (this.camera.bounds.overlaps(entity.bounds)) {
				entity.activated = true;
			}
		}

		// update all entities
		for (const entity of this.entities) {
			if (entity.activated) entity.update(deltaTime, this);
		}

		// check for entity collisions
		for (const entity of this.entities) {
			if (entity.activated) this.entityCollider.check(entity);
		}

		// finalize all updating of traits
		for (const entity of this.entities) {
			if (entity.activated) entity.finalize();
		}

		this.totalTime += deltaTime;
	}

	draw(context) {
		this.comp.draw(context, this.camera);
	}
}
