import Timer from "./Timer.js";
import Camera from "./Camera.js";
import { loadLevel } from "./loaders/level.js";
import { createMario } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
context.scale(2, 2);

Promise.all([createMario(), loadLevel("1-1")]).then(async ([mario, level]) => {
	mario.pos.set(64, 80);
	level.entities.add(mario);

	let paused = false;

	const input = setupKeyboard(mario);
	input.addMapping(" ", (e) => {
		paused = !paused;
	});
	input.listenTo(window);

	const camera = new Camera();
	window.camera = camera;

	level.comp.layers.push(createCollisionLayer(level));

	const timer = new Timer(1 / 60);
	timer.update = function update(deltaTime) {
		if (!paused) {
			level.update(deltaTime);

			if (mario.pos.x > 100) {
				camera.pos.x = mario.pos.x - 100;
			}
		}
		level.comp.draw(context, camera);
	};

	timer.start();
});
