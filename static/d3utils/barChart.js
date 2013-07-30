(function (d3, d3utils, _, undefined) {
    "use strict";

    d3utils.barChart = function (selector, data, options) {
        var _default = {
            totalWidth: 720,
            barHeight: 30,
            chartOffset: 200,
            valueLabel: String,
            keyLabel: String
        };
        options = _.extend(_default, options);

        var pairs = _.pairs(data).sort(function (a, b) {
            return b[1] - a[1];
        });

        var keys = _.map(pairs, function (x) { return x[0]; });
        var values = _.map(pairs, function (x) { return x[1]; });

        var totalWidth = options.totalWidth;
        var barHeight = options.barHeight;
        var chartOffset = options.chartOffset;
        var chartWidth = totalWidth - chartOffset;

        var chart = d3.select(selector).append("svg")
            .attr("class", "chart")
            .attr("width", totalWidth)
            .attr("height", barHeight * values.length);

        var domain = [0, _.max(values)];

        var x = d3.scale.linear()
            .domain(domain)
            .range([0, chartWidth]);

        chart.selectAll("rect")
            .data(values)
            .enter().append("rect")
            .attr("x", chartOffset)
            .attr("y", function (d, i) { return i * barHeight })
            .attr("width", x)
            .attr("height", barHeight);

        chart.append("line")
            .attr("x1", chartOffset)
            .attr("y1", 0)
            .attr("x2", chartOffset)
            .attr("y2", barHeight * values.length)
            .style("stroke", "#ccc")
            .style("stroke-width", "1px");

        var textY = function (d, i) {
            return i * barHeight + barHeight / 2;
        };

        // text for no. of commits
        chart.selectAll("text")
            .data(values)
            .enter().append("text")
            .attr("x", function (d) { return x(d) + chartOffset; })
            .attr("y", textY)
            .attr("dx", -5)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(options.valueLabel);

        chart.append("g")
            .selectAll("text")
            .data(keys)
            .enter().append("text")
            .attr("x", chartOffset - 5)
            .attr("y", textY)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .style("fill", "#333")
            .text(options.keyLabel);
    };

    d3utils.vertBarChart = function (selector, data, options) {

        var pairs = _.pairs(data).sort(function (a, b) {
            return +a[0] - +b[0];
        });

        var keys = _.map(pairs, function (x) { return x[0]; });
        var values = _.map(pairs, function (x) { return x[1]; });

        var w = 30;
        var h = d3.max(values) * 0.033;
        var labelHt = 20;

        var x = d3.scale.linear()
            .domain([0, 1])
            .range([0, w]);

        var y = d3.scale.linear()
            .domain([0, d3.max(values)])
            .rangeRound([0, h]);

        var chart = d3.select(selector).append("svg")
            .attr("class", "chart")
            .attr("width", w * values.length - 1)
            .attr("height", h+labelHt);

        chart.selectAll("rect")
            .data(values)
            .enter().append("rect")
            .attr("x", function(d, i) { return x(i) - .5; })
            .attr("y", function(d) { return h - y(d) - .5; })
            .attr("width", w)
            .attr("height", function(d) { return y(d); });

        chart.append("line")
            .attr("x1", 0)
            .attr("x2", w * values.length)
            .attr("y1", h - .5)
            .attr("y2", h - .5)
            .style("stroke", "#000");

        chart.append("g")
            .selectAll("text")
            .data(keys)
            .enter().append("text")
            .attr("x", function(d, i) { return x(i); })
            .attr("y", h)
            .attr("dx", "0.5em")
            .attr("dy", "1em")
            .style("fill", "#333")
            .text(function (d, i) { return keys[i]; });
    };

}) (d3, d3utils, _);
