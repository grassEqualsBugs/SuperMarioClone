export class Matrix {
	constructor() {
		this.grid = [];
	}

	forEach(callback) {
		this.grid.forEach((column, x) => {
			column.forEach((value, y) => {
				callback(value, x, y);
			});
		});
	}

	get(x, y) {
		const column = this.grid[x];
		if (column) {
			return column[y];
		}
		return undefined;
	}

	set(x, y, value) {
		if (!this.grid[x]) {
			this.grid[x] = [];
		}

		this.grid[x][y] = value;
	}
}

window.Matrix = Matrix;

export class Vec2 {
	constructor(x, y) {
		this.set(x, y);
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}
}
