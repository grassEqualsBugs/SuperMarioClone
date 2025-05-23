import Level from "../Level.js";
import { Matrix } from "../math.js";
import { loadJSON, loadSpriteSheet } from "../loaders.js";
import { createBackgroundLayer, createSpriteLayer } from "../layers.js";

function setupCollision(levelSpec, level) {
	const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
		return mergedTiles.concat(layerSpec.tiles);
	}, []);
	const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
	level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec, level, backgroundSprites) {
	for (const layer of levelSpec.layers) {
		const backgroundGrid = createBackgroundGrid(
			layer.tiles,
			levelSpec.patterns,
		);
		const backgroundLayer = createBackgroundLayer(
			level,
			backgroundGrid,
			backgroundSprites,
		);
		level.comp.layers.push(backgroundLayer);
	}
}

function setupEntities(levelSpec, level, entityFactory) {
	for (const {
		name,
		pos: [x, y],
	} of levelSpec.entities) {
		const entity = entityFactory[name]();
		entity.pos.set(x, y);
		level.entities.add(entity);
	}
	const spriteLayer = createSpriteLayer(level.entities);
	level.comp.layers.push(spriteLayer);
}

export function createLevelLoader(entityFactory) {
	return async function loadLevel(name) {
		const levelSpec = await loadJSON(`levels/${name}.json`);
		const backgroundSprites = await loadSpriteSheet(levelSpec.spritesheet);

		const level = new Level();
		setupCollision(levelSpec, level);
		setupBackgrounds(levelSpec, level, backgroundSprites);
		setupEntities(levelSpec, level, entityFactory);

		return level;
	};
}

function createCollisionGrid(tiles, patterns) {
	const grid = new Matrix();

	for (const { tile, x, y } of expandTiles(tiles, patterns)) {
		grid.set(x, y, { type: tile.type });
	}

	return grid;
}

function createBackgroundGrid(tiles, patterns) {
	const grid = new Matrix();

	for (const { tile, x, y } of expandTiles(tiles, patterns)) {
		grid.set(x, y, { name: tile.name });
	}

	return grid;
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
		yield* expandRange(range);
	}
}

function* expandTiles(tiles, patterns) {
	function* walkTiles(tiles, offsetX, offsetY) {
		for (const tile of tiles) {
			for (const { x, y } of expandRanges(tile.ranges)) {
				const derivedX = x + offsetX;
				const derivedY = y + offsetY;

				if (tile.pattern) {
					yield* walkTiles(
						patterns[tile.pattern].tiles,
						derivedX,
						derivedY,
					);
				} else {
					yield {
						tile,
						x: derivedX,
						y: derivedY,
					};
				}
			}
		}
	}

	yield* walkTiles(tiles, 0, 0);
}
