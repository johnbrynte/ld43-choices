var Body = function(opts) {

    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.width = opts.width || 0;
    this.height = opts.height || 0;
    this.rotation = 0;

    this.physics = null;
    if (opts.physics) {
        this.physics = new physics(this, opts.physics);
    }

    var graphics = new PIXI.Graphics();

    // draw a shape
    // graphics.moveTo(50, 50);
    // graphics.lineTo(250, 50);
    // graphics.lineTo(100, 100);
    // graphics.lineTo(50, 50);
    // graphics.endFill();

    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.beginFill(0x000000, 0);
    graphics.drawRect(this.x, this.y, this.width, this.height);

    this.graphics = graphics;

    world.add(this);

    var _this = this;

    this.update = function(d) {
        if (_this.physics) {
            _this.physics.update(d);
        }

        graphics.position.x = this.x;
        graphics.position.y = this.y;
        graphics.rotation = this.rotation;
    }

}