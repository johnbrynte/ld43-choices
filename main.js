var size = 800;

var renderer = PIXI.autoDetectRenderer(size, size, {
    antialias: true,
    transparent: true
});
document.body.appendChild(renderer.view);

var b = new Body({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    physics: {
        mass: 20,
    },
});

var floor = new Body({
    x: 0,
    y: 300,
    width: 400,
    height: 100,
    physics: {
        mass: 20,
        static: true,
    },
});

timer(function(d) {
    renderer.render(world.stage);
}, function(d) {
    //body.x = Math.cos(timer.t / 10) * 100 + 100;

    world.update(d);
});
