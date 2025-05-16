import Timer from "./Timer.js";
import { loadLevel } from "./loaders.js";
import { createMario } from "./entities.js";
import Keyboard from "./KeyboardState.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

Promise.all([createMario(), loadLevel("1-1")]).then(async ([mario, level]) => {
	const gravity = 1400;
	mario.pos.set(64, 80);
	level.entities.add(mario);

	// mario jumping
	const input = new Keyboard();
	input.addMapping(" ", (keyState) => {
		if (keyState) {
			mario.jump.start();
		} else {
			mario.jump.cancel();
		}
	});
	input.addMapping("ArrowRight", (keyState) => {
		mario.go.dir = keyState;
	});
	input.addMapping("ArrowLeft", (keyState) => {
		mario.go.dir = -keyState;
	});
	input.listenTo(window);

	["mousedown", "mousemove"].forEach((eventName) => {
		canvas.addEventListener(eventName, (event) => {
			if (event.buttons === 1) {
				mario.vel.set(0, 0);
				mario.pos.set(event.offsetX, event.offsetY);
			}
		});
	});

	// game timer
	const timer = new Timer(1 / 60);
	timer.update = function update(deltaTime) {
		level.update(deltaTime);
		level.comp.draw(context);
		mario.vel.y += gravity * deltaTime;
	};

	timer.start();
});
