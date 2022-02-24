class Rocket {
  constructor(ctx) {
    this.ctx = ctx;
    this.removeFromWorld = false;
    this.spriteSheet = ASSET_MANAGER.getAsset('./rocketsheettall.png');
    this.explodesheet = ASSET_MANAGER.getAsset("./explosion.png")
    this.explodeFrame = 0;
    this.elapsedTime = 0;
    this.frameDuration = .08;
    this.totalTime = 9 * this.frameDuration;
    this.width = 271;
    //this.truncY = 300 //Had this for a preliminary version for shortening the flames
    this.flame = 100
    this.height = 912;
    this.xStart = 0;
    this.yStart = 0;
    this.scale = .4;
    this.yscale = this.scale; //My rocket can stretch according to velocity, so the y-axis scales differently
    this.x = 500;
    this.y = 200;
    this.vx = 0;
    this.vy = 0;
    // this.vTheta = 100; // For when I'm testing and want the ship to spin at constant rate
    this.theta = Math.PI/2;
    this.vTheta = 0;
    this.mass = 1e5;
  }
  handleCollisions() {
    let that = this;
    gameEngine.entities.forEach(entity => {
      if(entity instanceof Planet) {
        let {x: ex, y: ey} = entity;
        let {x, y} = this;
        let dx = ex-x;
        let dy = ey-y;
        let dist = Math.sqrt(dx*dx+dy*dy);
        let nx = dx/dist;
        let ny = dy/dist;
        let force = that.mass * entity.mass * 9.8 *6.7e-11/ (Math.pow(dist, 3))
        this.vx += force*nx;
        this.vy += force*ny;
        if (dist < entity.size/2) {
          that.explode = true;
          gameEngine.click = false;
          that.update = () => {
            if(gameEngine.click) {
              loadLevel(that.ctx);
            }
          };
        }
      }
    })
  }
  update() {
    // this.theta += this.vTheta*gameEngine.clockTick * .01; //These lines are just used for testing when I comment out the if statement
    if (gameEngine.mouse) {
      if(gameEngine.mouseDown) {
        const {x: newX, y: newY} = gameEngine.mouse;
        //X and Y differences between current position and mouse position
        let dx = newX - this.x;
        let dy = newY - this.y;

        /* Angle section: kind of a mess but it works, much more work than distance change
         * Annoying bit is that arctangent only returns a relative angle that's correct in 2/4 quadrants
         * For this demo, I transform the canvas to the layout of a normal unit circle so I can visualize it better
         *    To correct for upside-downness I take the negative of the arctangent, and when I call ctx.rotate I use an offset of PI/2
         * Then, I handle each quadrant separately because until I did this, the ship's angle would cross 2PI, and instead of
         *    taking the short way to 2PI + .01, it would spin all the way back around to .01
         */
        let newTheta = -Math.atan((newY - this.y) / (newX - this.x))
        let diff;
        if (dx >= 0 && dy < 0) { // Quadrant 1
          //If mouse is in Q1 but ship is in Q4, prevent spinning a large negative angle by adding 2PI
          if(this.theta > 3*Math.PI / 2) diff = 2*Math.PI + (newTheta-this.theta);
          else diff = newTheta-this.theta
        }
        //These two quadrants have no problem
        else if (dx < 0 && dy < 0) { //Quadrant 2
          newTheta += Math.PI;
          diff = newTheta-this.theta
        }
        else if (dx < 0 && dy >= 0) { //Quadrant 3
          newTheta += Math.PI;
          diff = newTheta-this.theta
        }
        else if(dx >= 0 && dy >= 0) {
          newTheta = 2* Math.PI + newTheta;
          //If mouse is in Q4 but ship is in Q1, prevent spinning large positive angle by subtracting 2PI
          if(this.theta < Math.PI / 2) diff = -2*Math.PI + (newTheta-this.theta);
          else diff = newTheta-this.theta;
        }
        // The method of using (x+a)%a is well-known to be able to handle negative values
        // The .1 is to regulate how much the difference affects the angle, so it doesn't spin instantly, but has some weight
        // console.log(diff)
        this.vTheta += diff*1e-5* Math.sqrt(this.vx*this.vx+this.vy*this.vy)

        //Distance section
        // I decided to make change in velocity proportional to the change in distance
        const baseX = Math.sign(dx)*2
        const baseY = Math.sign(dy)*2
        this.vx += (dx/20)+baseX;
        this.vx *= 0.90; //Friction, make the constant smaller to increase friction and slow the ship
        this.vy += (dy/20)+baseY;
        this.vy *= 0.90;
      }

      this.handleCollisions()
      //Use velocity, let ship wrap around the canvas with modulo using same (x+a)%a trick as before
      this.x = (this.x + this.vx * gameEngine.clockTick+this.ctx.canvas.width) % this.ctx.canvas.width;
      this.y  = (this.y + this.vy * gameEngine.clockTick+this.ctx.canvas.height) % this.ctx.canvas.height;
      if(gameEngine.mouseDown) this.vTheta *= .8
      else this.vTheta *= .99
      this.theta  = (this.theta + this.vTheta+2*Math.PI) % (2 * Math.PI);

      // Flame size is proportional to the squared magnitude speed, so I calculate that first.
      const  speed = (this.vx * this.vx + this.vy * this.vy)
      this.flame = speed / 10000 + 70 //This constant used in draw method, 70 is minimum flame size

      // Stretch ship according to squared speed, this constant used in draw method
      this.yscale = this.scale * (1 + speed / 160000000);
    }
  }

  //Advance spritesheet, shape flame, rotate and stretch ship
  draw() {
    if(this.explode) {
      this.ctx.drawImage(
        this.explodesheet, Math.floor(this.explodeFrame/5)*600, 0, 600, 600,
        this.x - this.width / 2, this.y - this.width / 2, this.width, this.width
      )
      if(this.explodeFrame < 15) this.explodeFrame++;
      return;
    }
    //Choose frame
    this.elapsedTime+=gameEngine.clockTick;
    if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
    let frame = Math.floor(this.elapsedTime / this.frameDuration)

    //Create secondary canvas to clip the rocket ship to shape the flame
    let clipCanvas = document.createElement('canvas');
    clipCanvas.width = this.width;
    clipCanvas.height = this.height;
    let c = clipCanvas.getContext('2d');
    //See parker's video
    c.imageSmoothingEnabled = false;

    //Begin clipping portion to shape rocket flame
    // Idea is that flame size changes according to speed, but a flat line would look bad, and making a bunch of
    //different-size flame sprites is a lot of work. I could also use an image to mask, but I decided to use a path
    //
    c.beginPath();
    let w = clipCanvas.width;
    let h = clipCanvas.height;

    let x1 = w*0.3; //left side of nozzle
    let x2 = w*0.7; //right side of nozzle
    let y = h*0.6; //vertical position of nozzle

    c.moveTo(x1,y);
    //Draw from left side of nozzle to almost the apex of the flame
    c.bezierCurveTo(x1-this.flame*0.1, y+this.flame*0.7, (x1+x2)/2-30, y+this.flame*0.9,
      (x1+x2)/2-12, y+this.flame);
    //Draw small curve at apex of flame so that instead of a point, it can grow wider and reveal the whole flame at high speeds
    c.bezierCurveTo((x1+x2)/2, y+this.flame*1.03, (x1+x2)/2, y+this.flame*1.03,
      (x1+x2)/2+12, y+this.flame);
    //Draw from apex of flame to right side of nozzle
    c.bezierCurveTo((x1+x2)/2+30, y+this.flame*0.9, x2+this.flame*0.1, y+this.flame*0.7,
      x2, y)

    //Draw around rest of the ship so it doesn't get clipped out
    c.lineTo(w*0.85, h*0.6)
    c.lineTo(w, h)
    c.lineTo(w, 0)
    c.lineTo(0, 0)
    c.lineTo(0, h)
    c.lineTo(w*0.15, h*0.6)
    c.lineTo(x1, y)
    c.closePath();
    c.clip();
    // c.fillRect(0, 0, w, h); //Uncomment this to see what the mask looks like!
    //Use the mask
    c.drawImage(this.spriteSheet,
      this.xStart + frame * this.width, this.yStart,
      this.width, this.height,
      0, 0,
      this.width, this.height)


    // Begin rotation section
    //  This rotation is about the tip of the rocket ship rather than the center, so to see an example of that, scroll
    //  down to commented-out version
    // Because I am rotating about tip, I need canvas twice as large to fit all possible rotations.

    let offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = this.height * this.yscale*2;
    offScreenCanvas.height = this.height * this.yscale*2;

    let offScreenCtx = offScreenCanvas.getContext('2d');
    offScreenCtx.imageSmoothingEnabled = false; //Parker's video
    offScreenCtx.save();
    // c.strokeStyle="Black" //debugging
    // offScreenCtx.fillRect(0, 0, offScreenCtx.width, offScreenCtx.height); //For visualizing the canvas

    //Translate canvas to middle in order to rotate about tip since canvas is double-size
    offScreenCtx.translate(offScreenCanvas.height/2, offScreenCanvas.height/2);
    //By making angle negative and offsetting by PI/2, it rotates as it would on the unit circle
    offScreenCtx.rotate(-this.theta+Math.PI/2);
    //Translate back
    offScreenCtx.translate(-offScreenCanvas.height/2, -offScreenCanvas.height/2);

    //Because my sprites are rectangular but my canvas is square, offset x by the appropriate amount to center it
    //Notice I am drawing my clipped canvas rather than my image
    offScreenCtx.drawImage(clipCanvas,
      (this.height*2*this.yscale-this.width*this.scale) / 2, this.height*this.yscale, //If have a sprite that is wider than high, add same thing for dy
      this.width*this.scale,
      this.height*this.yscale);
    offScreenCtx.restore();

    //Bring it all together
    //Notice I am drawing my rotation canvas rather than my image
    //I shift x by the distance from the edge of the square canvas to the edge of the sprite (see same expression above)
    //I also subtract off half the width of the sprite to center it rather than drawing at the corner
    //y's distance to the edge of the canvas is exactly its height, and I choose not to center it vertically.
    //If you read the alternate drawing method below which rotates about the center, the correction factors are different
    //because the offscreen canvas size is half.
    //The other reason my offsets are more complicated is that the x-scaling factor and the y-scaling factor are independent.
    this.ctx.drawImage(offScreenCanvas,
      this.x - (this.height*2*this.yscale-this.width*this.scale)/2-this.width/2*this.scale, //scale the offset
      this.y - this.height*this.yscale, // scale the offset
      this.height*this.yscale*2, this.height*2*this.yscale) // scale
    c.restore()
  }

  // //rotate about center
  // draw() {
  //   // this.ctx.strokeStyle="black"
  //   // this.ctx.strokeRect(this.x-this.height/2*this.scale, this.y-this.height/2*this.scale, this.height*this.scale, this.height*this.scale);
  //   // this.ctx.save();
  //   this.elapsedTime+=gameEngine.clockTick;
  //   if(this.elapsedTime >= this.totalTime) this.elapsedTime -= this.totalTime;
  //   let frame = Math.floor(this.elapsedTime / this.frameDuration)
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
