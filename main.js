var size = 800;

var renderer = new PIXI.WebGLRenderer(size, size, {
    antialias: true,
    transparent: true,
    autoResize: false,
});
document.getElementById("container").appendChild(renderer.view);

var b = new Body({
    x: size / 2,
    y: 100,
    width: 100,
    height: 100,
    physics: {
        mass: 200,
        gravity: false,
    },
});

var floor = new Body({
    x: size / 2,
    y: size / 2,
    width: 400,
    height: 100,
    physics: {
        mass: 20,
        static: true,
    },
});

world.update(0);

input.setContext(renderer.view);

var t = 0;

timer(function(d) {
    renderer.render(world.stage);
}, function(d) {
    t += d;

    if (t < 1) return;
    //body.x = Math.cos(timer.t / 10) * 100 + 100;

    var air = 0.1;
    b.addForce(-b.physics.speed.x * air, -b.physics.speed.y * air);

    var move = input.get(input.events.touchmove);
    if (move) {
        var f = 2;
        b.addForce((move.x - b.x) * f, (move.y - b.y) * f);
        // b.x = move.x - 50;
        // b.y = move.y - 50;
    }

    world.update(d);

    input.lateUpdate(d);
});
