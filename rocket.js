class Rocket {
  constructor(ctx) {
    this.ctx = ctx;
    this.spriteSheet = ASSET_MANAGER.getAsset('./rocketsheet.png');
    this.elapsedTime = 0;
    this.trueTime = 0;
    this.frameDuration = 0.06;
    this.totalTime = 9 * this.frameDuration;
    this.width = 271;
    this.height = 624;
    this.xStart = 0;
    this.yStart = 0;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
  }

  update() {
    this.x = 100*Math.cos(this.trueTime*2)+100;
    this.y = 100*Math.sin(this.trueTime*2)+100;
  }
  draw() {
    this.elapsedTime+=gameEngine.clockTick;
    this.trueTime+= gameEngine.clockTick;
    if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
    let frame = Math.floor(this.elapsedTime / 0.2)
    this.ctx.drawImage(this.spriteSheet,
      this.xStart + frame * this.width, this.yStart,
      this.width, this.height,
      this.x, this.y,
      this.width * this.scale,
      this.height*this.scale);
  }
}
