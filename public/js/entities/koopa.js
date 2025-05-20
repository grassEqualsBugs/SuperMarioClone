import Entity from "../Entity.js";
import { loadSpriteSheet } from "../loaders.js";
import PendulumWalk from "../traits/PendulumWalk.js";

export async function loadKoopa() {
	const sprite = await loadSpriteSheet("koopa");
	return createKoopaFactory(sprite);
}

function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");

	function drawKoopa(context) {
		sprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.collisionOffset.y = 8;

		koopa.addTrait(new PendulumWalk());

		koopa.draw = drawKoopa;
		return koopa;
	};
}
