var world = (function() {

    var self = {
        stage: null,
        children: [],

        add: add,
        remove: remove,
        update: update,
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
    }

})();