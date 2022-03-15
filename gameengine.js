// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        this.camera = {x:0, y:0}

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouseDown = null;
        this.click = false;
        this.wheel = null;
        this.keys = {};

        // THE KILL SWITCH
        this.running = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
            debugging: false,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
        this.stars = ASSET_MANAGER.getAsset('./stars.png')
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        this.ctx.canvas.addEventListener("click", e => {
            this.click = true;
        })

        this.ctx.canvas.addEventListener("mouseout", e => {
            this.mouseDown = false;
        })
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("mousedown", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.mouseDown = true;
        });

        this.ctx.canvas.addEventListener("mouseup", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.mouseDown = false;
        });


        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
        });

        window.addEventListener("keydown", event => this.keys[event.key] = true);
        window.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.camera.x = this.rocket.x - this.ctx.canvas.width/2
        this.camera.y = this.rocket.y - this.ctx.canvas.height/2
        // console.log(this.camera)
        // Draw latest things first

        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-this.camera.x*.1, this.ctx.canvas.height/2-1000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-2000 - this.camera.x*.1, this.ctx.canvas.height/2-1000-2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-this.camera.x*.1, this.ctx.canvas.height/2-1000-2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000+2000 - this.camera.x*.1, this.ctx.canvas.height/2-1000-2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-2000 - this.camera.x*.1, this.ctx.canvas.height/2-1000+2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000+2000 - this.camera.x*.1, this.ctx.canvas.height/2-1000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000+2000 - this.camera.x*.1, this.ctx.canvas.height/2-1000+2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-this.camera.x*.1, this.ctx.canvas.height/2-1000+2000 - this.camera.y*.1, 2000, 2000)
        this.ctx.drawImage(this.stars, 0, 0, 2000, 2000, this.ctx.canvas.width/2-1000-2000-this.camera.x*.1, this.ctx.canvas.height/2-1000 - this.camera.y*.1, 2000, 2000)
        for (let i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].draw(this.ctx, this);
        }
    };

    update() {
        let entitiesCount = this.entities.length;


        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)
