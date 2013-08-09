(function (window, d3utils) {
    "use strict";

    var $box_url_hits = $(".graph[rel='url-hits']").parent();
    var $box_browsers = $(".graph[rel='browsers']").parent();

    var urlHits = function () {
        $box_url_hits.spin();
        var defobj = $.getJSON('/url_hits');
        defobj.done(function (data) {
            if (data['ready']) {
                $box_url_hits.spin(false);
                var url_hits = data['url_hits'];
                d3utils.barChart(".graph[rel='url-hits']", url_hits, {
                    totalWidth: 500,
                    barHeight: 20,
                    keyLabel: function (k) {
                        return url_hits[k] < 5000 ? k + ' (' + url_hits[k] + ')' : k;
                    }
                });
            }
        });
        return defobj;
    };

    var browsers = function () {
        $box_browsers.spin();
        var defobj = $.getJSON('/browsers');
        defobj.done(function (data) {
            if (data['ready']) {
                $box_browsers.spin(false);
                var keys = d3.keys(data['browsers']);
                var values = d3.values(data['browsers']);
                d3utils.pieChart(".graph[rel='browsers']", values, keys, {
                    pieWidth: 270,
                    pieHeight: 270,
                    legend: d3utils.legend($(".graph[rel='browsers']"))
                });
            }
        });
        return defobj;
    };

    var getAnalytics = function () {
        $.when(urlHits(), browsers()).done(function () {
            console.log('done');
        });
    };

    getAnalytics();

}) (window, d3utils);
