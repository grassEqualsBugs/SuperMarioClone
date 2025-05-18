import Level from "./Level.js";
import SpriteSheet from "./SpriteSheet.js";
import { createBackgroundLayer, createSpriteLayer } from "./layers.js";
import { createAnim } from "./anim.js";

export async function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.src = url;
	});
}

export async function loadJSON(url) {
	const response = await fetch(url);
	return await response.json();
}

function createTiles(level, backgrounds) {
	function applyRange(background, xStart, xLength, yStart, yLength) {
		for (let x = xStart; x < xStart + xLength; ++x) {
			for (let y = yStart; y < yStart + yLength; ++y) {
				level.tiles.set(x, y, {
					name: background.tile,
					type: background.type,
				});
			}
		}
	}

	backgrounds.forEach((background) => {
		background.ranges.forEach((range) => {
			if (range.length === 4) {
				const [xStart, xLength, yStart, yLength] = range;
				applyRange(background, xStart, xLength, yStart, yLength);
			} else if (range.length == 3) {
				const [xStart, xEnd, yStart] = range;
				applyRange(background, xStart, xEnd, yStart, 1);
			} else if (range.length == 2) {
				const [xStart, yStart] = range;
				applyRange(background, xStart, 1, yStart, 1);
			}
		});
	});
}

export async function loadSpriteSheet(name) {
	const sheetSpec = await loadJSON(`/sprites/${name}.json`);
	const image = await loadImage(sheetSpec.imageURL);
	const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
	if (sheetSpec.tiles) {
		sheetSpec.tiles.forEach((tileSpec) => {
			sprites.defineTile(
				tileSpec.name,
				tileSpec.index[0],
				tileSpec.index[1],
			);
		});
	}
	if (sheetSpec.frames) {
		sheetSpec.frames.forEach((frameSpec) => {
			sprites.define(frameSpec.name, ...frameSpec.rect);
		});
	}
	if (sheetSpec.animations) {
		sheetSpec.animations.forEach((animSpec) => {
			const animation = createAnim(animSpec.frames, animSpec.frameLength);
			sprites.defineAnim(animSpec.name, animation);
		});
	}
	return sprites;
}

export async function loadLevel(name) {
	const levelSpec = await loadJSON(`levels/${name}.json`);
	const backgroundSprites = await loadSpriteSheet(levelSpec.spritesheet);

	const level = new Level();
	createTiles(level, levelSpec.backgrounds);

	// add background layer to Compositor
	const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
	level.comp.layers.push(backgroundLayer);

	// add sprite layer to Compositor
	const spriteLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(spriteLayer);

	return level;
}
