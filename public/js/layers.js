export function createBackgroundLayer(level, sprites) {
	const tiles = level.tiles;
	const tileResolver = level.tileCollider.tiles;

	const backgroundBuffer = document.createElement("canvas");
	backgroundBuffer.width = 272;
	backgroundBuffer.height = 240;

	const bufferContext = backgroundBuffer.getContext("2d");

	function redraw(drawFrom, drawTo) {
		for (let x = drawFrom; x <= drawTo; x++) {
			const col = tiles.grid[x];
			if (col) {
				col.forEach((tile, y) => {
					if (sprites.animations.has(tile.name)) {
						sprites.drawAnim(
							tile.name,
							bufferContext,
							x - drawFrom,
							y,
							level.totalTime,
						);
					} else {
						sprites.drawTile(
							tile.name,
							bufferContext,
							x - drawFrom,
							y,
						);
					}
				});
			}
		}
	}

	return function drawBackgroundLayer(context, camera) {
		const drawWidth = tileResolver.toIndex(camera.size.x);
		const drawFrom = tileResolver.toIndex(camera.pos.x);
		const drawTo = drawFrom + drawWidth;
		redraw(drawFrom, drawTo);

		context.drawImage(backgroundBuffer, -camera.pos.x % 16, -camera.pos.y);
	};
}

export function createSpriteLayer(entities, width = 64, height = 64) {
	const spriteBuffer = document.createElement("canvas");
	spriteBuffer.width = width;
	spriteBuffer.height = height;
	const spriteBufferContext = spriteBuffer.getContext("2d");

	return function drawSpriteLayer(context, camera) {
		for (const entity of entities) {
			spriteBufferContext.clearRect(0, 0, width, height);
			entity.draw(spriteBufferContext);
			context.drawImage(
				spriteBuffer,
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y,
			);
		}
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
		for (const { x, y } of resolvedTiles) {
			context.strokeRect(
				x * tileSize - camera.pos.x,
				y * tileSize - camera.pos.y,
				tileSize,
				tileSize,
			);
		}
		context.strokeStyle = "red";
		for (const entity of level.entities) {
			context.strokeRect(
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y,
				entity.size.x,
				entity.size.y,
			);
		}
		resolvedTiles.length = 0;
	};
}

export function createCameraLayer(cameraToDraw) {
	return function drawCameraRect(context, fromCamera) {
		context.strokeStyle = "purple";
		context.strokeRect(
			cameraToDraw.pos.x - fromCamera.pos.x,
			cameraToDraw.pos.y - fromCamera.pos.y,
			cameraToDraw.size.x,
			cameraToDraw.size.y,
		);
	};
}
