// Eg at https://bl.ocks.org/mbostock/3887118
export default class ScatterPlot {

  constructor(container_id, x_name, y_name, y_max) {
    document.getElementById(container_id).style.transition = "all 0.4s ease-in-out";

  }

  // un joli scatterplot zoomable qui serait joli à faire : http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e

  var data = [[1, 4], [8, 9], [1, 2]];

  // set the margins
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  // set some default mapping colors
  var color = d3.scale.category10();

  var x = d3.scale.linear()
  .range([0, width]);
  // define the x-axis
  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var y = d3.scale.linear()
  .range([height, 0]);
  // define the y-axis
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

  // create our SVG canvas
  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g") // group SVG shapes together
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // label the x-axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Number of sales");

  // label the y-axis
  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Score in reviews")

  // map each point to a game
  svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", 3.5)
  .attr("cx", function(d) { return x; })
  .attr("cy", function(d) { return y; })
  .style("fill", function(d) { return color(0); });
}
