export async function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.src = url;
	});
}

export async function loadLevel(name) {
	const response = await fetch(`levels/${name}.json`);
	const data = await response.json();
	return data;
}
