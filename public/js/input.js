import Keyboard from "./KeyboardState.js";

export function setupKeyboard(entity) {
	const input = new Keyboard();
	input.addMapping("p", (keyState) => {
		if (keyState) {
			entity.jump.start();
		} else {
			entity.jump.cancel();
		}
	});
	input.addMapping("d", (keyState) => {
		entity.go.dir += keyState ? 1 : -1;
	});
	input.addMapping("a", (keyState) => {
		entity.go.dir += -keyState ? -1 : 1;
	});
	return input;
}
