import Level from "./Level.js";
import {
	createBackgroundLayer,
	createSpriteLayer,
	createCollisionLayer,
} from "./layers.js";
import { loadBackgroundSprites } from "./sprites.js";

export async function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.src = url;
	});
}

function createTiles(level, backgrounds) {
	backgrounds.forEach((background) => {
		background.ranges.forEach(([x1, x2, y1, y2]) => {
			for (let x = x1; x < x2; ++x) {
				for (let y = y1; y < y2; ++y) {
					level.tiles.set(x, y, {
						name: background.tile,
					});
				}
			}
		});
	});
}

export async function loadLevel(name) {
	const response = await fetch(`levels/${name}.json`);
	const [levelSpec, backgroundSprites] = await Promise.all([
		response.json(),
		loadBackgroundSprites(),
	]);

	const level = new Level();
	createTiles(level, levelSpec.backgrounds);

	// add background layer to Compositor
	const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
	level.comp.layers.push(backgroundLayer);

	// add sprite layer to Compositor
	const spriteLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(spriteLayer);

	// add debug collision layer to Compositor
	const collisionLayer = createCollisionLayer(level);
	level.comp.layers.push(collisionLayer);

	return level;
}
