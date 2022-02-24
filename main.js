let gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload('./rocketsheettall.png')
ASSET_MANAGER.queueDownload('./planets.png')
ASSET_MANAGER.queueDownload('./explosion.png')
let rocket = null;

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

	gameEngine.addEntity(rocket);
	gameEngine.addEntity(new Planet(ctx, 0, 100, 200, 400))
	gameEngine.addEntity(new Planet(ctx, 1, 200, 1200, 800))
	gameEngine.addEntity(new Planet(ctx, 2, 300, 700, 1000))

	gameEngine.start();
	console.log(gameEngine.entities.length)
}
