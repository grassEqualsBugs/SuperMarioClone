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
		for (const tileSpec of sheetSpec.tiles) {
			sprites.defineTile(
				tileSpec.name,
				tileSpec.index[0],
				tileSpec.index[1],
			);
		}
	}
	if (sheetSpec.frames) {
		for (const frameSpec of sheetSpec.frames) {
			sprites.define(frameSpec.name, ...frameSpec.rect);
		}
	}
	if (sheetSpec.animations) {
		for (const animSpec of sheetSpec.animations) {
			const animation = createAnim(animSpec.frames, animSpec.frameLength);
			sprites.defineAnim(animSpec.name, animation);
		}
	}
	return sprites;
}
