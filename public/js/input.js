import Keyboard from "./KeyboardState.js";

export function setupKeyboard(mario) {
	const input = new Keyboard();
	input.addMapping("p", (keyState) => {
		if (keyState) {
			mario.jump.start();
		} else {
			mario.jump.cancel();
		}
	});
	input.addMapping("o", (keyState) => {
		mario.turbo(keyState);
	});
	input.addMapping("d", (keyState) => {
		mario.go.dir += keyState ? 1 : -1;
	});
	input.addMapping("a", (keyState) => {
		mario.go.dir += -keyState ? -1 : 1;
	});
	return input;
}
