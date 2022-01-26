let count = 0; class Rocket { constructor(ctx) { this.ctx = ctx;
    this.spriteSheet = ASSET_MANAGER.getAsset('./rocketsheettall.png');
    this.elapsedTime = 0;
    this.trueTime = 0;
    this.frameDuration = .08;
    this.totalTime = 9 * this.frameDuration;
    this.width = 271;
    this.realHeight = 912
    //this.truncY = 300
    this.flame = 100
    this.height = this.realHeight; //-this.truncY;
    this.xStart = 0;
    this.yStart = 0;
    this.scale = .4;
    this.yscale = this.scale;
    this.x = 500;
    this.y = 200;
    this.vx = 0;
    this.vy = 0;
    this.vTheta = 100;
    this.theta = Math.PI/2;
  }
update() {
   // this.theta += this.vTheta*gameEngine.clockTick * .01;
  //this.height = this.realHeight - this.truncY * 0;
  if (gameEngine.mouse) {
      const {x: newX, y: newY} = gameEngine.mouse;
      let dx = newX - this.x;
      let dy = newY - this.y;

      let newTheta = -Math.atan((newY - this.y) / (newX - this.x))
      let diff;
      if (dx >= 0 && dy < 0) { // Quadrant 1
        if(this.theta > 3*Math.PI / 2) diff = 2*Math.PI + (newTheta-this.theta);
         else diff = newTheta-this.theta
      }
      else if (dx < 0 && dy < 0) {
        newTheta += Math.PI;
        diff = newTheta-this.theta
      }
      else if (dx < 0 && dy >= 0) {
        newTheta += Math.PI;
        diff = newTheta-this.theta
      }
      else if(dx >= 0 && dy >= 0) {
        newTheta = 2* Math.PI + newTheta;
        if(this.theta < Math.PI / 2) diff = -2*Math.PI + (newTheta-this.theta);
        else diff = newTheta-this.theta;
      }
      this.vx += (newX - this.x)^2  / 1e2 * Math.sign(newX - this.x);
       // this.vx += (newX - this.x) / 30;
      this.vx *= 0.90;
      this.vy += (newY - this.y)^2 / 1e2 * Math.sign (newY - this.y);
      // this.vy += (newY - this.y) / 30;
      this.vy *= 0.90;
      // this.theta += this.vTheta*gameEngine.clockTick * .01;
      const  speed = (this.vx * this.vx + this.vy * this.vy)*1.5
    this.yscale = this.scale * (1 + speed / 250000000);
      //this.height = this.realHeight - this.truncY * (1 - speed / 3000000)
      this.flame = speed / 10000 + 70
      this.theta  = (this.theta + diff*.1+2*Math.PI) % (2 * Math.PI);
      this.x = (this.x + this.vx * gameEngine.clockTick+this.ctx.canvas.width) % this.ctx.canvas.width;
      this.y  = (this.y + this.vy * gameEngine.clockTick+this.ctx.canvas.height) % this.ctx.canvas.height;
    }
    // this.x = 100*Math.cos(this.trueTime*2)+100;
    // this.y = 100*Math.sin(this.trueTime*2)+100;
  }
  draw() {
    // this.ctx.save();
    this.elapsedTime+=gameEngine.clockTick;
    this.trueTime+= gameEngine.clockTick;
    if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
    let frame = Math.floor(this.elapsedTime / this.frameDuration)

    let clipCanvas = document.createElement('canvas');
    clipCanvas.width = this.width;
    clipCanvas.height = this.height;
    let c = clipCanvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.beginPath();
    let w = clipCanvas.width;
    let h = clipCanvas.height;

    let x1 = w*0.3;
    let x2 = w*0.7;
    let y = h*0.6;

    c.moveTo(x1,y);
    // c.moveTo((x1+x2)/2, y+this.flame)
    let t = this.flame*0.08;
    c.bezierCurveTo(x1-this.flame*0.1, y+this.flame*0.7, (x1+x2)/2-this.flame/t*2, y+this.flame*0.9,
      (x1+x2)/2-this.flame/t, y+this.flame);
    c.bezierCurveTo((x1+x2)/2, y+this.flame*1.03, (x1+x2)/2, y+this.flame*1.03,
      (x1+x2)/2+this.flame/t, y+this.flame);
    c.bezierCurveTo((x1+x2)/2+this.flame/t*2, y+this.flame*0.9, x2+this.flame*0.1, y+this.flame*0.7,
      x2, y)
    // c.lineTo(x2,y);

    c.lineTo(w*0.85, h*0.6)
    c.lineTo(w, h)
    c.lineTo(w, 0)
    c.lineTo(0, 0)
    c.lineTo(0, h)
    c.lineTo(w*0.15, h*0.6)
    c.lineTo(x1, y)
    c.closePath();
    c.clip();
    // c.fillRect(0, 0, w, h);

    c.drawImage(this.spriteSheet,
      this.xStart + frame * this.width, this.yStart,
      this.width, this.height,
      0, 0,
      this.width, this.height)

    let offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = this.height * this.yscale*2;
    offScreenCanvas.height = this.height * this.yscale*2;



    let offScreenCtx = offScreenCanvas.getContext('2d');
    offScreenCtx.imageSmoothingEnabled = false;
    offScreenCtx.save();
    // c.strokeStyle="Black"
    // offScreenCtx.fillRect(0, 0, offScreenCtx.width, offScreenCtx.height);
    offScreenCtx.translate(offScreenCanvas.height/2, offScreenCanvas.height/2);
    offScreenCtx.rotate(-this.theta+Math.PI/2);
    offScreenCtx.translate(-offScreenCanvas.height/2, -offScreenCanvas.height/2);

    // this.ctx.strokeStyle="Black"
    // this.ctx.fillRect(this.x-this.height*this.yscale, this.y-this.height*this.yscale, this.height*2*this.yscale, this.height*2*this.yscale);
    // offScreenCtx.moveTo(this.width * this.scale*0.25, this.height*this.yscale*0.9)
    // offScreenCtx.lineTo(this.width*this.scale*0.75, this.height*this.yscale*0.9);
    // offScreenCtx.lineTo(this.width*this.scale*0.75, this.height*this.yscale)
    // offScreenCtx.lineTo(this.width*this.scale*0.25, this.height*this.yscale)
    // offScreenCtx.closePath();
    // offScreenCtx.clip();



    offScreenCtx.drawImage(clipCanvas,
      (this.height*2*this.yscale-this.width*this.scale) / 2, this.height*this.yscale, //If have a sprite that is wider than high, add same thing for dy
      this.width*this.scale,
      this.height*this.yscale);
    // offScreenCtx.drawImage(this.spriteSheet,
    //   this.xStart + frame * this.width, this.yStart,
    //   this.width, this.height,
    //   (this.height*2*this.yscale-this.width*this.scale) / 2, this.height*this.yscale, //If have a sprite that is wider than high, add same thing for dy
    //   this.width*this.scale,
    //   this.height*this.yscale);

    offScreenCtx.restore();

    this.ctx.drawImage(offScreenCanvas,
      this.x - (this.height*2*this.yscale-this.width*this.scale)/2-this.width/2*this.scale, //scale the offset
      this.y - this.height*this.yscale, // scale the offset
      this.height*this.yscale*2, this.height*2*this.yscale) // scale
    c.restore()
    // this.ctx.fillRect(this.x-15, this.y-15, 30, 30);
  }
  //Rotate about tip
  // draw() {
  //   // this.ctx.strokeStyle="Black"
  //   // this.ctx.strokeRect(this.x-this.height*this.scale, this.y-this.height*this.scale, this.height*2*this.scale, this.height*2*this.scale);
  //   // this.ctx.save();
  //   this.elapsedTime+=gameEngine.clockTick;
  //   this.trueTime+= gameEngine.clockTick;
  //   if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
  //   let frame = Math.floor(this.elapsedTime / this.frameDuration)
  //   let offScreenCanvas = document.createElement('canvas');
  //   offScreenCanvas.width = this.height * this.scale*2;
  //   offScreenCanvas.height = this.height * this.scale*2;
  //   let offScreenCtx = offScreenCanvas.getContext('2d');
  //   offScreenCtx.imageSmoothingEnabled = false;
  //   offScreenCtx.save();
  //   offScreenCtx.translate(offScreenCanvas.height/2, offScreenCanvas.height/2);
  //   offScreenCtx.rotate(-this.theta+Math.PI/2);
  //   offScreenCtx.translate(-offScreenCanvas.height/2, -offScreenCanvas.height/2);
  //   offScreenCtx.drawImage(this.spriteSheet,
  //     this.xStart + frame * this.width, this.yStart,
  //     this.width, this.height,
  //     (this.height*2-this.width)*this.scale / 2, this.height*this.scale, //If have a sprite that is wider than high, add same thing for dy
  //     this.width*this.scale,
  //     this.height*this.scale);
  //   offScreenCtx.restore();
  //
  //   this.ctx.drawImage(offScreenCanvas,
  //     this.x - (this.height*2-this.width)/2 * this.scale-this.width/2*this.scale, //scale the offset
  //     this.y - this.height*this.scale, // scale the offset
  //     this.height*this.scale*2, this.height*2*this.scale) // scale
  //   // this.ctx.fillRect(this.x-15, this.y-15, 30, 30);
  // }
  //Rotate about center
  // draw() {
  //   // this.ctx.strokeStyle="Black"
  //   // this.ctx.strokeRect(this.x-this.height/2*this.scale, this.y-this.height/2*this.scale, this.height*this.scale, this.height*this.scale);
  //   // this.ctx.save();
  //   this.elapsedTime+=gameEngine.clockTick;
  //   this.trueTime+= gameEngine.clockTick;
  //   if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
  //   let frame = Math.floor(this.elapsedTime / this.frameDuration)
  //   // this.ctx.drawImage(this.spriteSheet,
  //   //   this.xStart + frame * this.width, this.yStart,
  //   //   this.width, this.height,
  //   //   this.x-this.width/2*this.scale, this.y-this.height/2*this.scale,
  //   //   this.width * this.scale,
  //   //   this.height*this.scale);
  //   let offScreenCanvas = document.createElement('canvas');
  //   offScreenCanvas.width = this.height * this.scale;
  //   offScreenCanvas.height = this.height * this.scale;
  //   let offScreenCtx = offScreenCanvas.getContext('2d');
  //   offScreenCtx.imageSmoothingEnabled = false;
  //   offScreenCtx.save();
  //   offScreenCtx.translate(offScreenCanvas.height / 2, offScreenCanvas.height/2);
  //   offScreenCtx.rotate(-this.theta+Math.PI/2);
  //   offScreenCtx.translate(offScreenCanvas.height / -2, offScreenCanvas.height / -2);
  //   offScreenCtx.drawImage(this.spriteSheet,
  //     this.xStart + frame * this.width, this.yStart,
  //     this.width, this.height,
  //     (this.height-this.width)*this.scale / 2, 0, //If have a sprite that is wider than high, add same thing for dy
  //     this.width*this.scale,
  //     this.height*this.scale);
  //   offScreenCtx.restore();
  //
  //   this.ctx.drawImage(offScreenCanvas,
  //     this.x - this.height/2*this.scale, //scale the offset
  //     this.y - this.height/2*this.scale, // scale the offset
  //     this.height*this.scale, this.height*this.scale) // scale
  //   // this.ctx.fillRect(this.x-15, this.y-15, 30, 30);
  // }
}
