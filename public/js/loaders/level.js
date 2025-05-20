import Level from "../Level.js";
import { loadJSON, loadSpriteSheet } from "../loaders.js";
import { createBackgroundLayer, createSpriteLayer } from "../layers.js";

export async function loadLevel(name) {
	const levelSpec = await loadJSON(`levels/${name}.json`);
	const backgroundSprites = await loadSpriteSheet(levelSpec.spritesheet);

	const level = new Level();
	for (const { tile, x, y } of expandTiles(
		levelSpec.tiles,
		levelSpec.patterns,
	)) {
		level.tiles.set(x, y, { name: tile.name, type: tile.type });
	}

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

function* expandRanges(ranges) {
	for (const range of ranges) {
		for (const item of expandRange(range)) {
			yield item;
		}
	}
}

function expandTiles(tiles, patterns) {
	const expandedTiles = [];

	function walkTiles(tiles, offsetX, offsetY) {
		for (const tile of tiles) {
			for (const { x, y } of expandRanges(tile.ranges)) {
				const derivedX = x + offsetX;
				const derivedY = y + offsetY;

				if (tile.pattern) {
					walkTiles(patterns[tile.pattern].tiles, derivedX, derivedY);
				} else {
					expandedTiles.push({
						tile,
						x: derivedX,
						y: derivedY,
					});
				}
			}
		}
	}

	walkTiles(tiles, 0, 0);

	return expandedTiles;
}
