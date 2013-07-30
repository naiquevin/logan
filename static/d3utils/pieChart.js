(function (d3, d3utils, undefined) {
    "use strict";

    var Colors = function () {
        this.colors = d3.scale.category20();
        var that = this;
        this.fill = function (d, i) {
            return that.colors(i);
        }
    };

    d3utils.pieChart = function (selector, values, keys, options) {
        var _default = {
            pieWidth: 400,
            pieHeight: 400,
            colors: new Colors,
            textLabel: function (d, i) {
                return d.value;
            },
            legend: false
        };
        options = _.extend(_default, options || {});

        var width = options.pieWidth,
        height = options.pieHeight,
        outerRadius = Math.min(width, height) / 2,
        innerRadius = outerRadius * .6,
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

        var vis = d3.select(selector)
            .append("svg")
            .data([values])
            .attr("width", width)
            .attr("height", height);

        var arcs = vis.selectAll("g.arc")
            .data(donut)
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        arcs.append("path")
            .attr("fill", options.colors.fill)
            .attr("d", arc);

        arcs.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("display", function(d) { return d.value > .15 ? null : "none"; })
            .text(options.textLabel);

        if (options.legend) {
            options.legend(keys, values, options.colors);
        }
    };

}) (d3, d3utils);
