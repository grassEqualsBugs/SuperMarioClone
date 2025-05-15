import Entity from "./Entity.js";
import { loadMarioSprites } from "./sprites.js";

export async function createMario() {
	return loadMarioSprites().then((sprite) => {
		const mario = new Entity();
		mario.update = function updateMario(deltaTime) {
			this.pos.x += this.vel.x * deltaTime;
			this.pos.y += this.vel.y * deltaTime;
		};
		mario.draw = function drawMario(context) {
			sprite.draw("idle", context, this.pos.x, this.pos.y);
		};
		return mario;
	});
}
