import Timer from "./Timer.js";
import Camera from "./Camera.js";
import { loadLevel } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");
// context.imageSmoothingEnabled = false;
// context.scale(3, 3);

Promise.all([loadEntities(), loadLevel("1-1")]).then(
	async ([entity, level]) => {
		const mario = entity.mario();
		mario.pos.set(64, 80);
		level.entities.add(mario);

		const goomba = entity.goomba();
		goomba.pos.x = 220;
		goomba.vel.x = -1400;
		level.entities.add(goomba);

		const koopa = entity.koopa();
		koopa.pos.x = 360;
		koopa.vel.x = -1400;
		level.entities.add(koopa);

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
	},
);
