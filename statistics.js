var statistics = (function() {
    var self = {
        log: log,
        getStatistics: getStatistics,
        reset: reset,
    };

    var events = {
        "bot_new": [],
        "bot_dead": [],
    };

    return self;

    //////////////

    function log(ev, data) {
        if (!events[ev]) {
            events[ev] = [];
        }
        events[ev].push({
            t: timer.t,
            data: data,
        });

        getStatistics();
    }

    function reset() {
        events["bot_new"] = [];
        events["bot_dead"] = [];
    }

    function getStatistics() {
        var stats = {};

        var killed = events["bot_dead"];
        var alive = [];
        events["bot_new"].forEach(function(e) {
            var _e = killed.find(function(_e) {
                return e.data.id == _e.data.id;
            });
            if (!_e) {
                alive.push(e);
            }
        })

        stats.total = events["bot_new"].length;

        // alive

        stats.saved = getGroupStats(alive);
        stats.killed = getGroupStats(killed);

        showStat($(".result_alive"), stats.saved);
        showStat($(".result_dead"), stats.killed);

        $(".info__inner").html(stats.saved.total);

        return stats;
    }

    function getGroupStats(group) {
        var stats = {
            total: group.length,
        };

        var average = {};

        average.color = 0;
        average.width = 0;
        average.height = 0;
        average.deformed = 0;
        average.shape = 0;

        group.forEach(function(e) {
            average.color += e.data.color;
            average.width += e.data.width;
            average.height += e.data.height;
            average.deformed += e.data.deformed;
            average.shape += e.data.shape;
        });
        average.color /= stats.total;
        average.width /= stats.total;
        average.height /= stats.total;
        average.deformed /= stats.total;
        average.shape /= stats.total;

        stats.average = average;

        var variance = {};

        variance.color = 0;
        variance.width = 0;
        variance.height = 0;
        variance.deformed = 0;
        variance.shape = 0;

        group.forEach(function(e) {
            variance.color += Math.pow(e.data.color - average.color, 2);
            variance.width += Math.pow(e.data.width - average.width, 2);
            variance.height += Math.pow(e.data.height - average.height, 2);
            variance.deformed += Math.pow(e.data.deformed - average.deformed, 2);
            variance.shape += Math.pow(e.data.shape - average.shape, 2);
        });

        variance.color /= stats.total;
        variance.width /= stats.total;
        variance.height /= stats.total;
        variance.deformed /= stats.total;
        variance.shape /= stats.total;

        stats.variance = variance;
        stats.deviation = {
            color: Math.sqrt(variance.color),
            width: Math.sqrt(variance.width),
            height: Math.sqrt(variance.height),
            deformed: Math.sqrt(variance.deformed),
            shape: Math.sqrt(variance.shape),
        };

        return stats;
    }

    function showStat(parent, stats) {
        parent.html("");
        showStatHelper(parent, stats, "average");
        showStatHelper(parent, stats, "deviation");
    }

    function showStatHelper(parent, stats, stat) {
        parent
            .append(
                $("<h2>").html(stat + ":")
            );
        for (var s in stats[stat]) {
            parent
                .append(
                    $("<h3>").html("&nbsp;" + s)
                )
                .append(
                    $("<p>").html("&nbsp;&nbsp;" + parse(s, stats[stat][s]))
                )
        }

        function parse(s, v) {
            switch (s) {
                case "color":
                    if (v < 30 || v > 340)
                        return "red";
                    if (v < 45)
                        return "orange";
                    if (v < 60)
                        return "yellow";
                    if (v < 150)
                        return "green";
                    if (v < 240)
                        return "blue";
                    if (v < 300)
                        return "purple";
                    return "pink";
                default:
                    break;
            }
            return Math.round(v * 10) / 10;
        }
    }

})();