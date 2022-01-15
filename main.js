const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload('./rocketsheet.png')

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);
	const rocket = new Rocket(ctx);
	gameEngine.addEntity(rocket);

	gameEngine.start();
});
