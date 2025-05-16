export function createBackgroundLayer(level, sprites) {
	const backgroundBuffer = document.createElement("canvas");
	backgroundBuffer.width = 256;
	backgroundBuffer.height = 240;

	const bufferContext = backgroundBuffer.getContext("2d");
	level.tiles.forEach((tile, x, y) => {
		sprites.drawTile(tile.name, bufferContext, x, y);
	});

	return function drawBackgroundLayer(context) {
		context.drawImage(backgroundBuffer, 0, 0);
	};
}

export function createSpriteLayer(entities) {
	return function drawSpriteLayer(context) {
		entities.forEach((entity) => {
			entity.draw(context);
		});
	};
}

export function createCollisionLayer(level) {
	const resolvedTiles = [];

	const tileResolver = level.tileCollider.tiles;
	const tileSize = tileResolver.tileSize;

	const getByIndexOriginal = tileResolver.getByIndex;
	tileResolver.getByIndex = function getByIndexFake(x, y) {
		resolvedTiles.push({ x, y });
		// pass "this" through
		return getByIndexOriginal.call(tileResolver, x, y);
	};

	return function drawCollisions(context) {
		context.strokeStyle = "blue";
		resolvedTiles.forEach(({ x, y }) => {
			context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
		});
		context.strokeStyle = "red";
		level.entities.forEach((entity) => {
			context.strokeRect(
				entity.pos.x,
				entity.pos.y,
				entity.size.x,
				entity.size.y,
			);
		});
		resolvedTiles.length = 0;
	};
}
