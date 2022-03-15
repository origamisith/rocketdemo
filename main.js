const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload('./rocketsheettall.png')
ASSET_MANAGER.queueDownload('./planets.png')
ASSET_MANAGER.queueDownload('./explosion.png')
ASSET_MANAGER.queueDownload('./win.png')
ASSET_MANAGER.queueDownload('./stars.png')
let rocket = null;

let gameEngine = new GameEngine();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);
	loadLevel(ctx);
});

function loadLevel(ctx) {
	gameEngine.entities.forEach(e => e.removeFromWorld = true)
	rocket = new Rocket(ctx);

	gameEngine.rocket = rocket;
	gameEngine.addEntity(rocket);
	let {width, height} = gameEngine.ctx.canvas;
	//
	let positions = [];
	for(let i = 0; i < 50; i++) {
		let x, y;
		do {
			x = Math.random() * width * 9 - width * 4.5;
			y = Math.random() * height * 9 - height * 4.5;
		} while(!checkDist({x:x, y:y}, positions))
		positions.push({x:x, y:y})
		if(i < 3) {
			gameEngine.addEntity(new Planet(ctx, 3, 300, x, y))
			continue;
		}
		const size = Math.random() * 500+50;
		const type = Math.floor(Math.random() * 3);
		gameEngine.addEntity(new Planet(ctx, type, size, x, y))
	}

	gameEngine.start();
	console.log(gameEngine.entities.length)
}

function checkDist(curr, list) {
	if(((curr.x - 500)*(curr.x-500)+(curr.y-200)*(curr.y-200)) < 1000*1000) return false;
	let result = true;
	list.forEach(pos => {
		if(((curr.x - pos.x)*(curr.x-pos.x) + (curr.y-pos.y)*(curr.y-pos.y)) < 600*600) {
			result = false;
		}
	})
	return result;
}
