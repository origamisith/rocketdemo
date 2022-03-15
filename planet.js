class Planet {
  constructor(ctx, type, size, x, y) {
    this.ctx = ctx;
    this.removeFromWorld = false;
    this.spritesheet = ASSET_MANAGER.getAsset("./planets.png");
    this.type = type; //0, 1, or 2
    this.pixelSize = 600;
    this.size = size;
    this.mass = Math.pow(size, 3)*45e4
    this.x = x;
    this.y = y;
  }
  draw() {
    let {x, y} = gameEngine.camera;
    this.ctx.drawImage(
      this.spritesheet, this.type * this.pixelSize, 0, this.pixelSize, this.pixelSize,
      this.x - this.size / 2 - x, this.y - this.size / 2-y, this.size, this.size
    )
  }
  update() {
  }
}
