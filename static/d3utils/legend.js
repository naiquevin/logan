(function (d3, d3utils, _, undefined) {
    "use strict";

    d3utils.legend = function ($graph) {
        return function (keys, values, colors) {
            var $legend = $('<ul class="legend"></ul>');
            $legend.html(_.map(keys, function (d, i) {
                return '<li><div style="background: '+colors.fill(d, i)+'"></div>'+keys[i]+' <span>'+values[i]+'</span></li>';
            }));
            // adjustments to fit in the graph and legend side by side
            $("svg", $graph).css({
                'float': 'left',
                'margin-right': '10px'
            }).after($legend);
        };
    };

}) (d3, d3utils, _);
