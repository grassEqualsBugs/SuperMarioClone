import BoundingBox from "./BoundingBox.js";
import { Vec2 } from "./math.js";

export default class Camera {
	constructor() {
		this.pos = new Vec2(0, 0);
		this.size = new Vec2(256, 224);
		this.bounds = new BoundingBox(this.pos, this.size, new Vec2(0, 0));
	}
}
