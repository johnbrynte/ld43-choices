var Bot = function(opts) {

    var _this = this;

    this.id = Bot.ID++;

    this.body = new Body({
        x: opts.x,
        y: opts.y,
        width: 60 + Math.random() * 20,
        height: 60 + Math.random() * 20,
        physics: {
            mass: 200 + Math.random() * 100,
        },
    });

    this.time = 0;

    var color = Math.floor(0xFFFFFF * Math.random());
    var shape = Math.floor(Math.random() * 3);

    var g = this.body.graphics;

    g.clear();

    g.lineStyle(6, color, 1);
    g.beginFill(0x000000, 0);

    var r = 3 + [0, 1, 20][shape];
    var offset = Math.random();
    var first = null;
    for (var i = 0; i < r; i++) {
        var a = offset + i * (2 * Math.PI) / r;
        var x = Math.cos(a) * this.body.width / 2;
        var y = Math.sin(a) * this.body.height / 2;
        if (i == 0) {
            g.moveTo(x, y);
            first = {
                x: x,
                y: y,
            }
        } else {
            g.lineTo(x, y);
        }
    }
    g.lineTo(first.x, first.y);

    g.endFill();
    // graphics.moveTo(50, 50);
    // graphics.lineTo(250, 50);
    // graphics.lineTo(100, 100);
    // graphics.lineTo(50, 50);
    // graphics.endFill();

    var nextDecision = 0;
    var consts = {
        decisionTime: 0.1 + Math.random() * 0.3,
    };

    this.update = function(d) {
        if (!_this.body.physics.colliding) {
            var air = 0.03;
            _this.body.addForce(-_this.body.physics.speed.x * air, -_this.body.physics.speed.y * air);
        }

        nextDecision += d;
        if (nextDecision > consts.decisionTime) {
            if (_this.body.physics.colliding) {
                if (Math.random() < 0.7) {
                    _this.body.physics.speed.x += Math.random() * 200 - 100;
                    _this.body.physics.speed.y -= 400;

                    nextDecision = 0;
                }
            }
        }

        if (_this.body.y > size) {
            Bot.remove(_this);

            statistics.log("bot_dead", _this.getData());
        }

        _this.time += d;

        // if (_this.body.physics.colliding) {
        //     _this.body.generateGraphics(0xff0000);
        // } else {
        //     _this.body.generateGraphics(0xffffff);
        // }
    };

    this.getData = function() {
        var c = color.toString(16);
        while (c.length < 6) {
            c = "0" + c;
        }
        c = "#" + c;
        var tc = tinycolor(c);
        var hsl = tc.toHsl();

        return {
            id: _this.id,
            time: _this.time,
            width: _this.body.width,
            height: _this.body.height,
            deformed: Math.max(_this.body.width, _this.body.height) / Math.min(_this.body.width, _this.body.height),
            color: hsl.h,
            shape: shape,
        };
    }

    Bot.add(this);

};

Bot.ID = 1;

Bot.bots = [];

Bot.add = function(bot) {
    Bot.bots.push(bot);
}

Bot.remove = function(bot) {
    bot.body.remove();

    Bot.bots.splice(Bot.bots.indexOf(bot), 1);
}

Bot.update = function(d) {
    Bot.bots.forEach(function(bot) {
        bot.update(d);
    });
};