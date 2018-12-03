var size = 1000;

var renderer = new PIXI.WebGLRenderer(size, size, {
    antialias: true,
    transparent: true,
    autoResize: false,
});
document.getElementById("container").appendChild(renderer.view);

// var b = new Body({
//     x: size / 2,
//     y: 100,
//     width: 100,
//     height: 100,
//     physics: {
//         mass: 200,
//         gravity: false,
//     },
// });

new Body({
    x: size / 2,
    y: size - 175,
    width: size - 400,
    height: 50,
    physics: {
        mass: 20,
        static: true,
    },
});

new Body({
    x: 250,
    y: size - 425,
    width: 50,
    height: size - 400,
    physics: {
        mass: 20,
        static: true,
    },
});

new Body({
    x: size - 250,
    y: size - 425,
    width: 50,
    height: size - 400,
    physics: {
        mass: 20,
        static: true,
    },
});

world.update(0);

input.setContext(renderer.view);

var scoreText = new PIXI.Text('', { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff, align: 'center' });
scoreText.position.x = size / 2;
scoreText.position.y = 100;
scoreText.anchor.x = 0.5;
world.stage.addChild(scoreText);

var t = 0;
var generation = 0;

var active = null;
var activePoint = null;

function newBot() {
    var w = size - 400;
    var bot = new Bot({
        x: (size - w) / 2 + Math.random() * w,
        y: 0,
    });

    statistics.log("bot_new", bot.getData());
}

$("#reset").on("click", function() {
    reset();
})

function reset() {
    while (Bot.bots.length > 0) {
        Bot.remove(Bot.bots[0]);
    };

    statistics.reset();


    for (var i = 0; i < 20; i++) {
        newBot();
    }
}

reset();

var quicker = 4;

timer(function(d) {
    renderer.render(world.stage);
}, function(d) {
    t += d;

    if (t < 0.2) return;
    //body.x = Math.cos(timer.t / 10) * 100 + 100;

    // var air = 0.1;
    // b.addForce(-b.physics.speed.x * air, -b.physics.speed.y * air);

    generation += d;
    if (generation > quicker) {
        newBot();
        generation = 0;

        if (quicker > 0.5) {
            quicker -= 0.01;
        }
    }

    var start = input.get(input.events.touchstart);
    if (start) {
        var _b = world.getBodyAt(start.x, start.y);
        if (_b) {
            active = _b;
            activePoint = {
                x: start.x - _b.x,
                y: start.y - _b.y,
            };
        }
    }

    if (input.get(input.events.touchend)) {
        active = null;
    }

    var move = input.get(input.events.touchmove);
    if (move) {
        if (active) {
            var f = 1;
            console.log(active)
            active.addForce((move.x - active.x) * f, (move.y - active.y) * f);
        }
        // b.x = move.x - 50;
        // b.y = move.y - 50;
    }

    var bots = 0;
    Bot.bots.forEach(function(b) {
        if (b.body.x > 150 && b.body.x < size - 150 && b.body.y < size - 75) {
            bots++;
        }
    })
    //scoreText.text = bots;

    /////////////

    Bot.update(d);

    world.update(d);

    input.lateUpdate(d);
});
