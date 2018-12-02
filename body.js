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

  var graphics;

  function generateGraphics(color) {

    if (graphics) {
      graphics.clear();
    } else {
      graphics = new PIXI.Graphics();

      _this.graphics = graphics;
    }

    // draw a shape
    // graphics.moveTo(50, 50);
    // graphics.lineTo(250, 50);
    // graphics.lineTo(100, 100);
    // graphics.lineTo(50, 50);
    // graphics.endFill();

    // set a fill and a line style again and draw a rectangle
    graphics.lineStyle(4, color || 0xFFFFFF, 1);
    graphics.beginFill(0x000000, 0);
    graphics.drawRect(-_this.width / 2, -_this.height / 2, _this.width, _this.height);

  }

  this.generateGraphics = generateGraphics;

  var _this = this;

  generateGraphics();

  world.add(this);

  this.update = function(d) {
    if (_this.physics) {
      _this.physics.update(d);
    }

    graphics.position.x = _this.x;
    graphics.position.y = _this.y;
    graphics.rotation = _this.rotation;
  }

}