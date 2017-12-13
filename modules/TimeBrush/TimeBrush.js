// Inpired from https://bl.ocks.org/mbostock/6232537

import * as d3 from "d3";

export default class TimeBrush {
  constructor(container_id, timeInterval, dataManager) {

    let self = this;
    this.dataManager = dataManager;

    // ---------------------------------------------------------------------------
    // Set up parameters of our Time Brush
    // ---------------------------------------------------------------------------

    this.margin = {top: 0, right: 60, bottom: 40, left: 60};
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 120 - this.margin.top - this.margin.bottom;

    this.parseDate = d3.timeParse("%Y");

    this.xScale = d3.scaleLinear()
                    .domain(timeInterval)
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
            .ticks(35)
            .tickSize(-this.height)
            .tickFormat(function() { return null; }))
            .selectAll(".tick")
            .classed("tick--minor", function(d) { return d; });

    this.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.xScale)
            .ticks(17)
            .tickFormat(d3.format("d"))
            .tickPadding(0))
            .attr("text-anchor", null)
            .selectAll("text")
            .attr("x", -19)
            .attr("y", 15);

    this.brushended = function() {

        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var d0 = d3.event.selection.map(self.xScale.invert),
            d1 = d0.map(Math.round);

        // If empty when rounded, use floor & ceil instead.
        if (d1[0] >= d1[1]) {
          d1[0] = Math.floor(d0[0]);
          d1[1] = Math.offset(d1[0]);
        }

        dataManager.setTimeInterval(d1);

        d3.select(this).transition().call(d3.event.target.move, d1.map(self.xScale));
      }

    let brush = this.svg.append("g")
            .attr("class", "brush")
            .call(d3.brushX()
            .extent([[0, 0], [this.width, this.height]])
            .on("end", this.brushended));
  }
}
