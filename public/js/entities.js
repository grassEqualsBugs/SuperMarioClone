import Entity from "./Entity.js";
import Velocity from "./traits/Velocity.js";
import Go from "./traits/Go.js";
import { loadMarioSprites } from "./sprites.js";
import Jump from "./traits/Jump.js";

export async function createMario() {
	const sprite = await loadMarioSprites();
	const mario = new Entity();
	mario.size.set(14, 16);

	mario.addTrait(new Go());
	mario.addTrait(new Jump());
	// mario.addTrait(new Velocity());

	mario.draw = function drawMario(context) {
		sprite.draw("idle", context, 0, 0);
	};
	return mario;
}
