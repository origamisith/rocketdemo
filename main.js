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
	for(let i = 0; i < 50; i++) {
		const x = Math.random() * width*6 - width*3;
		const y = Math.random() * height*6 -height*3;
		const size = Math.random() * 500+50;
		const type = Math.floor(Math.random() * 3);
		if(i < 3) {
			gameEngine.addEntity(new Planet(ctx, 3, 300, x, y))
			continue;
		}
		gameEngine.addEntity(new Planet(ctx, type, size, x, y))
	}

	gameEngine.start();
	console.log(gameEngine.entities.length)
}
