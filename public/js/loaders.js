import SpriteSheet from "./SpriteSheet.js";
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
