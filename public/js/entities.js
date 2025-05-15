import Entity from "./Entity.js";
import Velocity from "./traits/Velocity.js";
import { loadMarioSprites } from "./sprites.js";
import Jump from "./traits/Jump.js";

export async function createMario() {
	return loadMarioSprites().then((sprite) => {
		const mario = new Entity();
		mario.addTrait(new Velocity());
		mario.addTrait(new Jump());

		mario.draw = function drawMario(context) {
			sprite.draw("idle", context, this.pos.x, this.pos.y);
		};
		return mario;
	});
}
