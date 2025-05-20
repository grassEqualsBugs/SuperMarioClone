import Entity, { Trait } from "../Entity.js";
import { loadSpriteSheet } from "../loaders.js";
import PendulumMove from "../traits/PendulumMove.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";

export async function loadKoopa() {
	const sprite = await loadSpriteSheet("koopa");
	return createKoopaFactory(sprite);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
	constructor() {
		super("behavior");
		this.state = STATE_WALKING;
		this.walkSpeed = null;
		this.panicSpeed = 300;
		this.hideTime = 0;
		this.hideDuration = 5;
	}

	collides(us, them) {
		if (us.killable.dead) return;
		if (them.stomper) {
			if (them.vel.y > us.vel.y) {
				this.handleStomp(us, them);
			} else {
				this.handleNudge(us, them);
			}
		}
	}

	handleNudge(us, them) {
		if (this.state === STATE_WALKING) {
			them.killable.kill();
		} else if (this.state === STATE_HIDING) {
			this.panic(us, them);
		} else if (this.state === STATE_PANIC) {
			const travelDir = Math.sign(us.vel.x); // -1 when left, 1 when right
			const impactDir = Math.sign(us.pos.x - them.pos.x);
			if (travelDir !== 0 && travelDir !== impactDir)
				them.killable.kill();
		}
	}

	handleStomp(us, them) {
		if (this.state === STATE_WALKING || this.state === STATE_PANIC) {
			this.hide(us);
		} else if (this.state === STATE_HIDING) {
			us.killable.kill();
			us.vel.set(100, -200);
			us.solid.obstructs = false;
		}
	}

	hide(us) {
		us.vel.x = 0;
		us.pendulumMove.enabled = false;
		if (this.walkSpeed == null) this.walkSpeed = us.pendulumMove.speed;
		this.hideTime = 0;
		this.state = STATE_HIDING;
	}

	unhide(us) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.walkSpeed;
		this.state = STATE_WALKING;
	}

	panic(us, them) {
		us.pendulumMove.enabled = true;
		us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
		this.state = STATE_PANIC;
	}

	update(us, deltaTime) {
		if (this.state === STATE_HIDING) {
			this.hideTime += deltaTime;
			if (this.hideTime > this.hideDuration) {
				this.unhide(us);
			}
		}
	}
}

function createKoopaFactory(sprite) {
	const walkAnim = sprite.animations.get("walk");
	const wakeAnim = sprite.animations.get("wake");

	function routeFrame(koopa) {
		if (koopa.behavior.state === STATE_HIDING) {
			if (koopa.behavior.hideTime > 3)
				return wakeAnim(koopa.behavior.hideTime);
			return "hiding";
		}
		if (koopa.behavior.state === STATE_PANIC) return "hiding";
		return walkAnim(koopa.lifetime);
	}

	function drawKoopa(context) {
		sprite.draw(routeFrame(this), context, 0, 0, this.vel.x < 0);
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set(16, 16);
		koopa.collisionOffset.y = 8;

		koopa.addTrait(new Solid());
		koopa.addTrait(new PendulumMove());
		koopa.addTrait(new Killable());
		koopa.killable.removeAfter = 2;
		koopa.addTrait(new Behavior());

		koopa.draw = drawKoopa;
		return koopa;
	};
}
