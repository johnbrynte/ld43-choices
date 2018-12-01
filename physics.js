var physics = function(body, opts) {

    opts = opts || {};

    this.body = body;

    this.mass = opts.mass || 1;
    this.static = typeof opts.static != "undefined" ? opts.static : false;

    this.speed = {
        x: 0,
        y: 0,
    };

    physics.add(this);

    var _this = this;

    this.update = function(d) {
        if (!_this.static) {
            _this.speed.y += _this.mass * physics.gravity * d;

            body.x += _this.speed.x * d;
            body.y += _this.speed.y * d;
        }

        var bodies = physics.getCollidingBodies(_this);
        if (bodies.length > 0) {
            console.log("Coliddion");
        }
    };

};

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
        if (ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height) {
            bodies.push(b);
        }
    });
    return bodies;
}