import Timer from "./Timer.js";
import Camera from "./Camera.js";
import Entity from "./Entity.js";
import PlayerController from "./traits/PlayerController.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

function createPlayerEnv(playerEntity) {
	const playerEnv = new Entity();
	const playerControl = new PlayerController();
	playerControl.checkpoint.set(64, 64);
	playerEnv.addTrait(playerControl);
	playerControl.setPlayer(playerEntity);
	return playerEnv;
}

async function main(canvas) {
	const context = canvas.getContext("2d");
	context.imageSmoothingEnabled = false;
	context.scale(3, 3);

	const entityFactory = await loadEntities();
	const levelLoader = createLevelLoader(entityFactory);

	const level = await levelLoader("1-1");

	// setup mario
	const mario = entityFactory.mario();
	const playerEnv = createPlayerEnv(mario);
	level.entities.add(playerEnv);

	// input
	const input = setupKeyboard(mario);
	input.listenTo(window);

	// debug collision layer
	level.comp.layers.push(createCollisionLayer(level));

	// start game
	const camera = new Camera();
	const timer = new Timer(1 / 60);
	timer.update = function update(deltaTime) {
		level.update(deltaTime);
		camera.pos.x = Math.max(0, mario.pos.x - 100);
		level.comp.draw(context, camera);
	};

	timer.start();
}

const canvas = document.getElementById("screen");
main(canvas);
