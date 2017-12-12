// Inspired from http://chimera.labs.oreilly.com/books/1230000000345/
// un scatterplot zoomable qui serait joli à faire : http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
import * as d3 from "d3";

export default class ScatterPlot {

  constructor(container_id, x_name, y_name) {
    // ---------------------------------------------------------------------------
    // Set up parameters of our Scatter Plot
    // ---------------------------------------------------------------------------
    // TODO: Create a Scatter Plot that is resizable with Screen size
    this.padding = 20;

    this.width = 1000;
    this.height = 500;

    this.nbXticks = 10;
    this.nbYticks = 10;

    this.container_id = container_id;

    this.x_name = x_name;
    this.y_name = y_name;

    // ---------------------------------------------------------------------------
    // Create our SVG canvas
    // ---------------------------------------------------------------------------
    this.tooltip = d3.select("#" + container_id)
                     .append("div")
                     .attr("class", "tooltip")
                     .style("opacity", 0.0);

    this.svg = d3.select('#' + container_id)
                .append("svg")
                .attr("width", this.width + this.padding*2)
                .attr("height", this.height + this.padding*2)
                .append("g")
                .attr("transform",
                        "translate(" + this.padding + "," + this.padding + ")");

    this.x_group = this.svg.append("g");
    this.y_group = this.svg.append("g");
  }


  update(newData) {
    // -------------------------------------------------------------------
    //  Compute Scaling functions
    // -------------------------------------------------------------------
    var padding = 2*this.padding;

    var tooltip = this.tooltip;

    let colorsPublishers = {
      "Nintendo": "#c22020",
      "Electronic Arts": "#4557a2",
      "Activision": "#4b402f",
      "Sony Computer Entertainment": "#00bbff",
      "Ubisoft": "#9bb4bf",
      "Take-Two Interactive": "#d1cb42",
      "THQ": "#b85901",
      "Konami Digital Entertainment": "#385b33",
      "Sega": "#331a49",
      "Namco Bandai Games": "#ff0060",
      "Microsoft Game Studios": "#16e800",
      "Atari": "#9f249c",
      "Capcom": "#80af97",
      "Square Enix": "#000186",
      "SquareSoft": "#c7be7f",
      "Enix Corporation": "#7c5277",
      "Tecmo Koei": "#4e4e4e"
    }

    var radius = 3;
    // Compute scale of x
    let xScale = d3.scaleLinear()
                   .domain([0, d3.max(newData, game => { return game.Global_Sales; })])
                   .range([this.padding, this.width + this.padding]);

    // Compute scale of y
    let yScale = d3.scaleLinear()
                   .domain([0, d3.max(newData, game => { return game.Critic_Score; })])
                   .range([this.height - this.padding, this.padding]);

    // -------------------------------------------------------------------
    // Set up the axis
    // -------------------------------------------------------------------

    // Set up x-axis
    let xAxis = d3.axisBottom()
                  .scale(xScale)
                  /*.ticks(this.nbXticks)*/;

    // Set up y-axis
    let yAxis = d3.axisLeft()
                  .scale(yScale)
                  /*.ticks(this.nbYticks)*/;


     // Create X axis and label it
    this.x_group.attr("class", "x axis")
                .attr("transform", "translate(0," + (this.height - this.padding) + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", this.width - 2*this.padding)
                .attr("y", -this.padding)
                .style("text-anchor", "end")
                .text(this.x_name)
                .style("fill", "black");

    // Create Y axis and label it
    this.y_group.attr("class", "y axis")
                .attr("transform", "translate(" + this.padding + ",0)")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("x", -this.padding)
                .attr("y", this.padding)
                .style("text-anchor", "end")
                .text(this.y_name)
                .style("fill", "black");

  // -------------------------------------------------------------------
  //  Create the circles
  // -------------------------------------------------------------------

    var circleAttrs = {
      cx: game => { return xScale(game.Global_Sales); },
      cy: game => { return yScale(game.Critic_Score); },
      fill: "black",
      r: radius
    };

    var circleAttrsHover = {
      fill: "orange",
      r: radius*2
    };

    // Create a circle for each game
    this.svg.selectAll("circle")
     .data(newData)
     .enter()
     .append("circle")
     .attr("class", "circle")
     .attr("cx", game => { return xScale(game.Global_Sales);})
     .attr("cy", game => { return yScale(game.Critic_Score);})
     .attr("fill", "black")
     .attr("r", radius)

     // Event handler when the mouse is over a point
     .on("mouseover", function(game) {
        d3.select(this)
        .transition()
        .duration(700)
        .attr("r", 2*radius)
        .attr("fill", "orange")
        .style("cursor", "pointer");

        tooltip.transition()
               .duration(400)
               .style("opacity", 0.7);
        tooltip.html(game.Name)
               .style("left", (d3.event.pageX - padding) + "px")
               .style("top", (d3.event.pageY - padding) + "px");
     })
     // Event handler when the mouse leaves the point
     .on("mouseout", function() {
        d3.select(this)
        .transition()
        .duration(700)
        .attr("r", radius)
        .attr("fill", "black");

        tooltip.transition()
               .duration(400)
               .style("opacity", 0.0);
     })
     // On Click, we want to add data to the array and chart
     .on("click", function(game) {
       tooltip.style("opacity", 1);

       tooltip.html(game.Name + "<br/>" +
                    "Year of Release:" + game.Year_of_Release + "<br/>" +
                    "Genre: " + game.Genre + "<br/>" +
                    "Publisher: " + game.Publisher
                    /* etc...*/)
                     /*.style("left", (d3.event.pageX - padding) + "px")
                     .style("top", (d3.event.pageY - padding) + "px")*/;

     });
  }
}
