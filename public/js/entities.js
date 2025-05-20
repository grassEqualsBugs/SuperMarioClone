import { loadMario } from "./entities/mario.js";
import { loadGoomba } from "./entities/goomba.js";
import { loadKoopa } from "./entities/koopa.js";

export async function loadEntities() {
	const [marioFactory, goombaFactory, koopaFactory] = await Promise.all([
		loadMario(),
		loadGoomba(),
		loadKoopa(),
	]);

	return {
		mario: marioFactory,
		goomba: goombaFactory,
		koopa: koopaFactory,
	};
}
