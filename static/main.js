(function (window, d3utils) {
    "use strict";
    
    var $box_url_hits = $(".graph[rel='url-hits']").parent();    

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

    var getAnalytics = function () {
        $.when(urlHits()).done(function (data) {
            console.log(data);
        });
    };

    getAnalytics();

}) (window, d3utils);
