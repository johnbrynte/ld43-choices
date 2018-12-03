var physics = function(body, opts) {

    opts = opts || {};

    this.body = body;

    this.mass = opts.mass || 1;
    this.static = typeof opts.static != "undefined" ? opts.static : false;
    this.gravity = typeof opts.gravity != "undefined" ? opts.gravity : true;

    this.speed = {
        x: 0,
        y: 0,
    };

    this.forces = [];

    colliding = null;

    var generateNewCol = true;

    physics.add(this);

    var _this = this;

    body.addForce = function(x, y) {
        _this.forces.push({
            x: x,
            y: y,
        });
    };

    this.update = function(d) {
        if (!_this.static) {
            if (_this.gravity) {
                _this.speed.y += _this.mass * physics.gravity * d;
            }

            _this.forces.forEach(function(f) {
                _this.speed.x += _this.mass * f.x * d;
                _this.speed.y += _this.mass * f.y * d;
            });
            _this.forces = [];

            body.x += _this.speed.x * d;
            body.y += _this.speed.y * d;
        }

        generateNewCol = true;
    };

    this.solve = function(d) {
        var bodies = physics.getCollidingBodies(_this);
        if (bodies.length > 0) {
            if (generateNewCol) {
                colliding = {
                    left: false,
                    top: false,
                    right: false,
                    bottom: false,
                };
                generateNewCol = false;
            }

            bodies.forEach(function(hit) {
                var b = hit.body;


                if (_this.static && b.static) {
                    return;
                }

                // apply to non-static
                var ab, bb, ap, bp;
                if (_this.static) {
                    ap = b;
                    bp = _this;
                    ab = b.body;
                    bb = body;
                } else {
                    ap = _this;
                    bp = b;
                    ab = body;
                    bb = b.body;
                }

                var dx = bb.width / 2 + ab.width / 2;
                var dy = bb.height / 2 + ab.height / 2;

                var containedX = ab.x - ab.width / 2 >= bb.x - bb.width / 2
                    && ab.x + ab.width / 2 <= bb.x + bb.width / 2;
                var containedY = ab.y - ab.height / 2 >= bb.y - bb.height / 2
                    && ab.y + ab.height / 2 <= bb.y + bb.height / 2;

                var alignY;
                if (containedX && !containedY) {
                    alignY = true;
                } else if (!containedX && containedY) {
                    alignY = false;
                } else {
                    var offsetX = Math.min(
                        Math.abs(ab.x - ab.width / 2 - (bb.x + bb.width / 2)),
                        Math.abs(ab.x + ab.width / 2 - (bb.x - bb.width / 2)));
                    var offsetY = Math.min(
                        Math.abs(ab.y - ab.height / 2 - (bb.y + bb.height / 2)),
                        Math.abs(ab.y + ab.height / 2 - (bb.y - bb.height / 2)));
                    if (offsetX < offsetY) {
                        alignY = false;
                    } else {
                        alignY = true;
                    }
                }

                if (alignY) {
                    if (Math.sign(ab.y - bb.y) > 0) {
                        colliding.top = true;
                    } else {
                        colliding.bottom = true;
                    }

                    if (!_this.static && !b.static) {
                        // share forces
                        var aspd = ap.speed.y;
                        var bspd = bp.speed.y;

                        ab.y -= 10 * d * (1 + hit.dy / 2 - ab.height / 2) * Math.sign(ab.y - bb.y);
                        ap.speed.y += bspd * 0.01;

                        bb.y -= 10 * d * (1 + hit.dy / 2 - bb.height / 2) * Math.sign(bb.y - ab.y);
                        bp.speed.y += aspd * 0.01;

                        ab.addForce(-ap.speed.x * 1 * d, 0);
                        bb.addForce(-bp.speed.x * 1 * d, 0);
                    } else {
                        //ab.y = bb.y + dy * Math.sign(ab.y - bb.y);
                        ab.y -= 20 * d * (1 + hit.dy / 2 - ab.height / 2) * Math.sign(ab.y - bb.y);
                        ap.speed.y -= ap.speed.y * 0.5;

                        ab.addForce(-ap.speed.x * 1 * d, 0);
                    }
                } else {
                    if (Math.sign(ab.x - bb.x) > 0) {
                        colliding.right = true;
                    } else {
                        colliding.left = true;
                    }

                    if (!_this.static && !b.static) {
                        // share forces
                        var aspd = ap.speed.x;
                        var bspd = bp.speed.x;

                        ab.x -= 10 * d * (1 + hit.dx / 2 - ab.width / 2) * Math.sign(ab.x - bb.x);
                        ap.speed.x += bspd * 0.01;

                        bb.x -= 10 * d * (1 + hit.dx / 2 - bb.width / 2) * Math.sign(bb.x - ab.x);
                        bp.speed.x += aspd * 0.01;

                        ab.addForce(0, -ap.speed.y * 1 * d);
                        bb.addForce(0, -bp.speed.y * 1 * d);
                    } else {
                        //ab.x = bb.x + dx * Math.sign(ab.x - bb.x);
                        ab.x -= 20 * d * (1 + hit.dx / 2 - ab.width / 2) * Math.sign(ab.x - bb.x);
                        ap.speed.x -= ap.speed.x * 0.5;

                        ab.addForce(0, -ap.speed.y * 1 * d);
                    }
                }
            });
            //body.generateGraphics(0xff0000);

            _this.colliding = colliding;
        } else {
            //body.generateGraphics(0x00ff00);

            if (generateNewCol) {
                _this.colliding = false;
            }
        }
    };

};

physics.solveSteps = 10;

physics.gravity = 9.82;

physics.bodies = [];

physics.add = function(body) {
    physics.bodies.push(body);
}

physics.remove = function(body) {
    physics.bodies.splice(physics.bodies.indexOf(body), 1);
}

physics.getCollidingBodies = function(body) {
    var bodies = [];
    physics.bodies.forEach(function(b) {
        if (b == body)
            return;

        var ab = body.body;
        var bb = b.body;
        if (Math.abs(ab.x - bb.x) < (ab.width + bb.width) / 2
            && Math.abs(ab.y - bb.y) < (ab.height + bb.height) / 2) {
            bodies.push({
                dx: bb.x - ab.x,
                dy: bb.y - ab.y,
                body: b,
            });
        }
    });
    return bodies;
}