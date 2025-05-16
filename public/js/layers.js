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
