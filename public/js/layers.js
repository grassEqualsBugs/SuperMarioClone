export function createBackgroundLayer(level, sprites) {
	const backgroundBuffer = document.createElement("canvas");
	backgroundBuffer.width = 2048;
	backgroundBuffer.height = 240;

	const bufferContext = backgroundBuffer.getContext("2d");
	level.tiles.forEach((tile, x, y) => {
		sprites.drawTile(tile.name, bufferContext, x, y);
	});

	return function drawBackgroundLayer(context, camera) {
		context.drawImage(backgroundBuffer, -camera.pos.x, -camera.pos.y);
	};
}

export function createSpriteLayer(entities, width = 64, height = 64) {
	const spriteBuffer = document.createElement("canvas");
	spriteBuffer.width = width;
	spriteBuffer.height = height;
	const spriteBufferContext = spriteBuffer.getContext("2d");

	return function drawSpriteLayer(context, camera) {
		entities.forEach((entity) => {
			spriteBufferContext.clearRect(0, 0, width, height);
			entity.draw(spriteBufferContext);
			context.drawImage(
				spriteBuffer,
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y,
			);
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

	return function drawCollisions(context, camera) {
		context.strokeStyle = "blue";
		resolvedTiles.forEach(({ x, y }) => {
			context.strokeRect(
				x * tileSize - camera.pos.x,
				y * tileSize - camera.pos.y,
				tileSize,
				tileSize,
			);
		});
		context.strokeStyle = "red";
		level.entities.forEach((entity) => {
			context.strokeRect(
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y,
				entity.size.x,
				entity.size.y,
			);
		});
		resolvedTiles.length = 0;
	};
}
