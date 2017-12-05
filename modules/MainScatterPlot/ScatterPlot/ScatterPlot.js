// Inspired from http://chimera.labs.oreilly.com/books/1230000000345/
// un scatterplot zoomable qui serait joli à faire : http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
export default class ScatterPlot {

  constructor(container_id, data, x_name, y_name) {
    this.container_id = container_id;
    this.data = data;
    this.x_name = x_name;
    this.y_name = y_name;
  }

  // ---------------------------------------------------------------------------
  // Set up parameters of our Scatter Plot
  // ---------------------------------------------------------------------------
  // TODO: Create a Scatter Plot that is resizable with Screen size
  var width = 500;
  var height = 300;

  var radius = 10;
  var padding = 20;

  var nbXticks = 10;
  var nbYticks = 10;

  // ---------------------------------------------------------------------------
  // Set up the axis
  // ---------------------------------------------------------------------------
  // Compute scale of x
  var xScale = d3.scale.linear()
                 .domain([0, d3.max(data, d => { return d[0]; })])
                 .range([padding, width - padding*2]);

  // Compute scale of y
  var yScale = d3.scale.linear()
                 .domain([0, d3.max(data, d => { return d[1]; })])
                 .range([height - padding, padding]);

  // Set up x-axis
  var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(nbXticks);

  // Set up y-axis
  var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(nbYticks);

  // ---------------------------------------------------------------------------
  // Create our SVG canvas
  // ---------------------------------------------------------------------------
  var svg = d3.select("body")
              .select("div#main_container")
              .select("div#scrolling_container")
              .select("div.row row_padded")
              .selectAll("div.col-xs")
  .           .select("div#scatterPlot_container")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  // Create a circle for each game
  svg.selectAll("circle")
     .data(dataset)
     .enter()
     .append("circle")
     .attr("cx", d => {
       return xScale(d[0]);
     })
     .attr("cy", d => {
       return yScale(d[1]);
     })
     .attr("r", radius);

   //Create X axis and label it
   svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + (height - padding) + ")")
     .call(xAxis)
     .append("text")
     .attr("class", "label")
     .attr("x", width - 2*padding)
     .attr("y", -6)
     .style("text-anchor", "end")
     .text(x_name)
     .style("fill", "black");

   //Create Y axis and label it
   svg.append("g")
     .attr("class", "y axis")
     .attr("transform", "translate(" + padding + ",0)")
     .call(yAxis)
     .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("x", -padding)
     .attr("y", 6)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .text(y_name)
     .style("fill", "black");
}
