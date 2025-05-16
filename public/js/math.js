export class Matrix {
	constructor() {
		this.grid = [];
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
