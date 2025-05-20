import Entity, { Trait } from "../Entity.js";
import PendulumMove from "../traits/PendulumMove.js";
import Killable from "../traits/Killable.js";
import { loadSpriteSheet } from "../loaders.js";

export async function loadGoomba() {
	const sprite = await loadSpriteSheet("goomba");
	return createGoombaFactory(sprite);
}

class Behavior extends Trait {
	constructor() {
		super("behavior");
	}

	collides(us, them) {
		if (us.killable.dead) return;

		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				us.killable.kill();
				us.pendulumMove.enabled = false;
				us.vel.x = 0;
			} else {
				them.killable.kill();
			}
		}
	}
}

function createGoombaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");

	function routeFrame(goomba) {
		if (goomba.killable.dead) return "flat";
		return walkAnim(goomba.lifetime);
	}

	function drawGoomba(context) {
		sprite.draw(routeFrame(this), context, 0, 0);
	}

	return function createGoomba() {
		const goomba = new Entity();
		goomba.size.set(16, 16);

		goomba.addTrait(new PendulumMove());
		goomba.addTrait(new Behavior());
		goomba.addTrait(new Killable());
		goomba.killable.removeAfter = 0.2;

		goomba.draw = drawGoomba;
		return goomba;
	};
}
