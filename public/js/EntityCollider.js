export default class EntityCollider {
	constructor(entities) {
		this.entities = entities;
	}

	check(subject) {
		for (const candidate of this.entities) {
			if (subject === candidate) continue;
			if (subject.bounds.overlaps(candidate.bounds)) {
				subject.collides(candidate);
				candidate.collides(subject);
			}
		}
	}
}
