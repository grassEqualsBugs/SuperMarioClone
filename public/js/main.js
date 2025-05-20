import Timer from "./Timer.js";
import Camera from "./Camera.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById("screen");

async function main(canvas) {
	const context = canvas.getContext("2d");
	context.imageSmoothingEnabled = false;
	context.scale(3, 3);

	const entityFactory = await loadEntities();
	const levelLoader = createLevelLoader(entityFactory);

	const level = await levelLoader("1-1");

	const mario = entityFactory.mario();
	mario.pos.set(64, 80);
	level.entities.add(mario);

	const input = setupKeyboard(mario);
	input.listenTo(window);

	level.comp.layers.push(createCollisionLayer(level));

	const camera = new Camera();
	const timer = new Timer(1 / 60);
	timer.update = function update(deltaTime) {
		level.update(deltaTime);
		if (mario.pos.x > 100) camera.pos.x = mario.pos.x - 100;
		level.comp.draw(context, camera);
	};

	timer.start();
}

main(canvas);
