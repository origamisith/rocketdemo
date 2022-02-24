class Planet {
  constructor(ctx, type, size, x, y) {
    this.ctx = ctx;
    this.removeFromWorld = false;
    this.spritesheet = ASSET_MANAGER.getAsset("./planets.png");
    this.type = type; //0, 1, or 2
    this.pixelSize = 600;
    this.size = size;
    this.mass = Math.pow(size, 3)*3e5
    this.x = x;
    this.y = y;
  }
  draw() {
    this.ctx.drawImage(
      this.spritesheet, this.type * this.pixelSize, 0, this.pixelSize, this.pixelSize,
      this.x - this.size / 2, this.y - this.size / 2, this.size, this.size
    )

  }
  update() {
  }
}
