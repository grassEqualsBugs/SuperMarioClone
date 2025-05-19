import Level from "../Level.js";
import { loadJSON, loadSpriteSheet } from "../loaders.js";
import { createBackgroundLayer, createSpriteLayer } from "../layers.js";

export async function loadLevel(name) {
	const levelSpec = await loadJSON(`levels/${name}.json`);
	const backgroundSprites = await loadSpriteSheet(levelSpec.spritesheet);

	const level = new Level();
	createTiles(level, levelSpec.tiles, levelSpec.patterns);

	// add background layer to Compositor
	const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
	level.comp.layers.push(backgroundLayer);

	// add sprite layer to Compositor
	const spriteLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(spriteLayer);

	return level;
}

function* expandSpan(xStart, xLength, yStart, yLength) {
	for (let x = xStart; x < xStart + xLength; ++x) {
		for (let y = yStart; y < yStart + yLength; ++y) {
			yield { x, y };
		}
	}
}

function expandRange(range) {
	if (range.length === 4) {
		const [xStart, xLength, yStart, yLength] = range;
		return expandSpan(xStart, xLength, yStart, yLength);
	} else if (range.length == 3) {
		const [xStart, xEnd, yStart] = range;
		return expandSpan(xStart, xEnd, yStart, 1);
	} else if (range.length == 2) {
		const [xStart, yStart] = range;
		return expandSpan(xStart, 1, yStart, 1);
	}
}

function createTiles(level, tiles, patterns, offsetX = 0, offsetY = 0) {
	tiles.forEach((tile) => {
		tile.ranges.forEach((range) => {
			for (const { x, y } of expandRange(range)) {
				const derivedX = x + offsetX;
				const derivedY = y + offsetY;

				if (tile.pattern) {
					createTiles(
						level,
						patterns[tile.pattern].tiles,
						patterns,
						derivedX,
						derivedY,
					);
				} else {
					level.tiles.set(derivedX, derivedY, {
						name: tile.name,
						type: tile.type,
					});
				}
			}
		});
	});
}
