import Level from "./Level.js";
import { createBackgroundLayer, createSpriteLayer } from "./layers.js";
import { loadBackgroundSprites } from "./sprites.js";

export async function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.src = url;
	});
}

export async function loadLevel(name) {
	const response = await fetch(`levels/${name}.json`);

	const [levelSpec, backgroundSprites] = await Promise.all([
		response.json(),
		loadBackgroundSprites(),
	]);

	const level = new Level();
	const backgroundLayer = createBackgroundLayer(
		levelSpec.backgrounds,
		backgroundSprites,
	);
	level.comp.layers.push(backgroundLayer);

	const spriteLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(spriteLayer);

	return level;
}
