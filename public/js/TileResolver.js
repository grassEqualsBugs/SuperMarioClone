export default class TileResolver {
	constructor(matrix, tileSize = 16) {
		this.matrix = matrix;
		this.tileSize = tileSize;
	}

	toIndex(pos) {
		return Math.floor(pos / this.tileSize);
	}

	toIndexRange(pos1, pos2) {
		const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
		const range = [];
		let pos = pos1;
		do {
			range.push(this.toIndex(pos));
			pos += this.tileSize;
		} while (pos < pMax);
		return range;
	}

	getByIndex(indexX, indexY) {
		const tile = this.matrix.get(indexX, indexY);
		if (tile) {
			const x1 = indexX * this.tileSize;
			const x2 = (indexX + 1) * this.tileSize;
			const y1 = indexY * this.tileSize;
			const y2 = (indexY + 1) * this.tileSize;
			return {
				tile,
				x1,
				x2,
				y1,
				y2,
			};
		}
	}

	searchByPosition(positionX, positionY) {
		return this.getByIndex(
			this.toIndex(positionX),
			this.toIndex(positionY),
		);
	}

	searchByRange(x1, x2, y1, y2) {
		const matches = [];
		this.toIndexRange(x1, x2).forEach((x) => {
			this.toIndexRange(y1, y2).forEach((y) => {
				const match = this.getByIndex(x, y);
				if (match) matches.push(match);
			});
		});
		return matches;
	}
}
