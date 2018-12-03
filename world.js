var world = (function() {

    var self = {
        stage: null,
        children: [],

        add: add,
        remove: remove,
        update: update,
        getBodyAt: getBodyAt,
    };

    init();

    return self;

    ///////////////////////

    function init() {
        self.stage = new PIXI.Container();
    }

    function add(body) {
        self.children.push(body);
        self.stage.addChild(body.graphics);
    }

    function remove(body) {
        self.children.splice(self.children.indexOf(body), 1);
        self.stage.removeChild(body.graphics);
    }

    function update(d) {
        self.children.forEach(function(c) {
            c.update(d);
        });

        for (var i = 0; i < physics.solveSteps; i++) {
            self.children.forEach(function(c) {
                c.solve(d / physics.solveSteps);
            });
        }
    }

    function getBodyAt(x, y) {
        var offset = 80;
        return self.children.find(function(c) {
            if (x >= c.x - c.width / 2 - offset && x <= c.x + c.width / 2 + offset
                && y >= c.y - c.height / 2 - offset && y <= c.y + c.height / 2 + offset) {
                return c;
            }
        });
    }

})();