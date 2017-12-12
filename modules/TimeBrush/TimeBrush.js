// Inpired from https://bl.ocks.org/mbostock/6232537

import * as d3 from "d3";

export default class TimeBrush {
  constructor(container_id, timeInterval, dataManager) {

    let self = this;
    this.dataManager = dataManager;

    // ---------------------------------------------------------------------------
    // Set up parameters of our Time Brush
    // ---------------------------------------------------------------------------

    this.margin = {top: 200, right: 40, bottom: 200, left: 40};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.xScale = d3.scaleTime()
                    .domain([new Date(2013, 7, 1), new Date(2013, 7, 15) - 1])
                    .rangeRound([0, this.width]);

    this.svg = d3.select("#" + container_id)
                 .append("svg")
                 .attr("width", this.width + this.margin.left + this.margin.right)
                 .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
            .attr("class", "axis axis--grid")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xScale)
            .ticks(d3.timeHour, 12)
            .tickSize(-this.height)
            .tickFormat(function() { return null; }))
            .selectAll(".tick")
            .classed("tick--minor", function(d) { return d.getHours(); });

    this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xScale)
            .ticks(d3.timeDay)
            .tickPadding(0))
            .attr("text-anchor", null)
            .selectAll("text")
            .attr("x", 6);

    this.brushended = function() {

        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var d0 = d3.event.selection.map(self.xScale.invert),
            d1 = d0.map(d3.timeDay.round);

        // If empty when rounded, use floor & ceil instead.
        if (d1[0] >= d1[1]) {
          d1[0] = d3.timeDay.floor(d0[0]);
          d1[1] = d3.timeDay.offset(d1[0]);
        }

        d3.select(this).transition().call(d3.event.target.move, d1.map(self.xScale));
      }

    let brush = this.svg.append("g")
            .attr("class", "brush")
            .call(d3.brushX()
            .extent([[0, 0], [this.width, this.height]])
            .on("end", this.brushended));
  }
}
