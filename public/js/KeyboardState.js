const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
	constructor() {
		this.keyStates = new Map(); // key states
		this.keyMap = new Map(); // callback for key press
	}

	addMapping(key, callback) {
		this.keyMap.set(key, callback);
	}

	handleEvent(event) {
		const { key } = event;
		if (!this.keyMap.has(key)) return;
		event.preventDefault();

		const keyState = event.type == "keydown" ? PRESSED : RELEASED;
		if (this.keyStates.get(key) == keyState) {
			return;
		}
		this.keyStates.set(key, keyState);
		this.keyMap.get(key)(keyState);
	}

	listenTo(window) {
		["keydown", "keyup"].forEach((eventName) => {
			window.addEventListener(eventName, (event) => {
				this.handleEvent(event);
			});
		});
	}
}
