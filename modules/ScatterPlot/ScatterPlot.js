// Inspired from http://chimera.labs.oreilly.com/books/1230000000345/
// un scatterplot zoomable qui serait joli à faire : http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
import * as d3 from "d3";

/*

  TODO : Find why when we compute the mean not all the circles move
  TODO : Implement zoom
  TODO : Implement mouseover/mousemove/mouseout on Mean circles
  TODO : Move PublisherMeanButton
  TODO : Repair mouseover for small circles
  TODO : Add color for Publishers in tooltip when clicking

*/

export default class ScatterPlot {

  constructor(container_id, x_name, y_name) {

    // We use "self" so we won't be confused when using "this" everywhere
    let self = this;

    // -------------------------------------------------------------------------
    //   Set up parameters of our Scatter Plot
    // -------------------------------------------------------------------------

    // SVG's parameters
    this.padding = 30;
    this.width = 940;
    this.height = 640;

    // Circles' parameters
    this.radius = 3;

    // Axis' parameters
    this.nbXticks = 20;
    this.nbYticks = 10;
    this.x_name = x_name;
    this.y_name = y_name;

    // Colors for top 20 Publishers
    this.colorsPublishers = {
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

    // Our data is empty at the beginning
    this.data = [];

    // -------------------------------------------------------------------------
    //   Create our SVG canvas and its components
    // -------------------------------------------------------------------------

    // Initialize an invisible tooltip used to display game's informations
    this.tooltip = d3.select("#" + container_id)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0.0);

    // Initialize the button to compute the Publishers' average
    // TODO: Position the button correctly
    this.publishersButton = d3.select("#" + container_id)
                              .append("div")
                              .attr("class", "publishers_button")
                              .append('g')
                              .style("left", "500px")
                              .style("top", "500px")
                              .html("Compute Mean Publishers");

    // Create the main SVG
    this.svg = d3.select('#' + container_id)
      .append("svg")
      .attr("width", this.width + 2 * this.padding)
      .attr("height", this.height + 2 * this.padding)
      .append("g")
      .attr("transform",
        "translate(" + this.padding + "," + this.padding + ")");

    // Create groups for our axis
    this.x_group = this.svg.append("g");
    this.y_group = this.svg.append("g");
  }

  /*zoom() {
      this.svg.select(".x.axis").call(xAxis);
      this.svg.select(".y.axis").call(yAxis);

      this.svg.selectAll(".dot")
          .attr("transform", transform);
  }*/

  update(newData) {

    // -------------------------------------------------------------------------
    //   Bring everything we need from the constructor in this function
    // -------------------------------------------------------------------------

    let self = this;
    self.data = newData;

    let colorsPublishers = this.colorsPublishers;

    // To compute Publisher's mean
    let publishersButton = this.publishersButton;
    let publishersMeanActivated = false;

    // The tooltip used to show informations about games
    var tooltip = this.tooltip;

    // -------------------------------------------------------------------
    //  Compute Scaling functions
    // -------------------------------------------------------------------

    // Compute scale of x
    let xScale = d3.scaleLinear()
      .domain([0, (self.data.length > 0)? d3.max(self.data, function(game) {
        return game.Global_Sales;
      }) : 0])
      .range([self.padding, self.width - self.padding])
      .nice();

    // Compute scale of y
    let yScale = d3.scaleLinear()
      .domain([0, (self.data.length > 0)? d3.max(self.data, function(game) {
        return game.Critic_Score;
      }) : 0])
      .range([self.height - self.padding, self.padding])
      .nice();

    // Compute scale of radius
    let rScale = d3.scaleLinear()
                    .domain([0, (self.data.length > 0)?
                      d3.max(self.data, function(game) {
                        return game.Global_Sales;
                      }) : 0])
                    .range([1, 50])
                    .clamp(true);

    // Compute scale of opacity
    let oScale = d3.scaleLinear()
                    .domain([0, d3.max(self.data, function(game) {
                      return game.Global_Sales;
                    })])
                    .range([0, 1])
                    .clamp(true);

    // -------------------------------------------------------------------
    // Set up the axis
    // -------------------------------------------------------------------

    // Set up x-axis
    let xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(self.nbXticks);

    // Set up y-axis
    let yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(self.nbYticks);

    // Create X axis and label it
    self.x_group.attr("class", "x axis")
      .attr("transform", "translate(0," + (self.height - self.padding) + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", self.width - self.padding)
      .attr("y", -15)
      .style("text-anchor", "end")
      .text(self.x_name)
      .style("fill", "black");

    // Create Y axis and label it
    self.y_group.attr("class", "y axis")
      .attr("transform", "translate(" + self.padding + ",0)")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", 100)
      .attr("y", 30)
      .text(self.y_name)
      .style("fill", "black");

    // -------------------------------------------------------------------------
    //    Create the circles
    // -------------------------------------------------------------------------

    // Create a circle for each game
    // Each game is identified uniquely with its NAME
    var circles = self.svg.selectAll("circle").data(self.data, function(d) {
      return d.Name;
    });

    circles.on("mouseover", function(game) {
              self.onMouseOverEventHandler(this, self, game, tooltip);
            })
            .on("mousemove", function() {
              self.setTooltipPosition(self, tooltip);
            })
            .on("mouseout", function() {
              self.onMouseOutEventHandler(this, self, tooltip);
            })
            .on("click", function(game) {
              self.onClickEventHandler(this, self, game, tooltip);
            });

    // Remove old circles when updating
    circles.exit()
      .style("opacity", 1)
      // Add a falling and fading transition animation
      .transition()
      .delay(function(d) {
        return Math.random() * 1000;
      })
      .duration(500)
      .attr("cy", yScale(0))
      .style("opacity", 0)
      .remove();

    // Add new circles for each data
    circles.enter()
      .append("circle")
      .attr("class", "circle")
      // Position the circles
      .attr("cx", function(game) {
        return xScale(game.Global_Sales);
      })
      .attr("cy", function(game) {
        return yScale(game.Critic_Score);
      })
      .attr("r", 0)
      // Add a popping transition animation
      .transition()
      .delay(function(game) {
        return Math.random() * 1000;
      })
      .ease(d3.easeElastic)
      .duration(3000)
      .attr("r", self.radius)
      // Give color and correct opacity to circles
      // Highlight the one whose Publisher is well known
      .attr("fill", function(game) {
        return (colorsPublishers[game.Publisher] == undefined)? "grey" : colorsPublishers[game.Publisher];
      })
      .attr("opacity", function(game) {
        return (colorsPublishers[game.Publisher] == undefined)? 0.2 : 1;
      });


    // Set the current circles position
    // Make them move when the data is updating
    circles.transition()
      .delay(function(d) {
        return Math.random() * 1000;
      })
      .ease(d3.easeElastic)
      .duration(5000)
      .style("opacity", 1)
      .attr("cx", function(game) {
        return xScale(game.Global_Sales);
      })
      .attr("cy", function(game) {
        return yScale(game.Critic_Score);
      });

    // -------------------------------------------------------------------------
    //    Mouse's events
    // -------------------------------------------------------------------------

    circles.on("mouseover", function(game) {
              self.onMouseOverEventHandler(this, self, game, tooltip);
            })
            .on("mousemove", function() {
              self.setTooltipPosition(self, tooltip);
            })
            .on("mouseout", function() {
              self.onMouseOutEventHandler(this, self, tooltip);
            })
            .on("click", function(game) {
              self.onClickEventHandler(this, self, game, tooltip);
            });

      // Publishers Button's events
      publishersButton.on("mouseover", function() {
        d3.select(this).style("cursor", "pointer");
      })
      .on("click", function() {
        publishersMeanActivated = true;
        let publishersAverage = self.computeMeanPublishers(self.data);
        // console.log("Name : " + publishersAverage[0][0] + " globalSalesAverage : " + publishersAverage[0][1] + " criticScoresAverage: " + publishersAverage[0][2]);
        var meanCircles = self.svg.selectAll("circle")
                                  .data(publishersAverage, function(publisher) {
                                    return publisher[0];
                                  })
                                  .attr("class", "meanCircle");


        // Create one circle per Publisher
        meanCircles.enter()
        .append("circle")
        .attr("cx", function(publisher) {
          return xScale(publisher[1]);
        })
        .attr("cy", function(publisher) {
          return yScale(publisher[2]);
        })
        .transition()
        .duration(5000)
        .attr("r", function(publisher) {
          return 10*publisher[1];
        })
        .attr("fill", function(publisher) {
          return (colorsPublishers[publisher[0]] == undefined)? "grey" : colorsPublishers[publisher[0]];
        })
        .style("opacity", function(publisher) {
          return (colorsPublishers[publisher[0]] == undefined)? 0.2 : 1;
        });

        // Move the current little circles to their mean
        circles.transition()
                .delay(function(d) {
                  return Math.random() * 1000;
                })
                .duration(3000)
                .attr("cx", function(game) {
                  return xScale(self.getMeanPublisherCoords(publishersAverage, game)[0]);
                })
                .attr("cy", function(game) {
                  return yScale(self.getMeanPublisherCoords(publishersAverage, game)[1]);
                })

      })
      .on("mouseout", function() {
      });
  }

  // ---------------------------------------------------------------------------
  //    Helpers Functions
  // ---------------------------------------------------------------------------

  // Event handler when we click on a circle corresponding to a game
  onClickEventHandler(context, self, game, tooltip) {
    // Find previously selected, unselect
    d3.select(".selected")
      .transition()
      .duration(400)
      .attr("r", self.radius);
    d3.select(".selected").classed("selected", false);

    // Select current item
    d3.select(context).classed("selected", true);

    d3.select(context).transition()
                   .duration(700)
                   .attr("r", 2 * self.radius)
                   .style("cursor", "pointer");

    // Display further informations about that game
    tooltip.html(game.Name.bold().italics() + "<br/>" +
      "<br/><div id=\"game_info\">Year of Release: " + game.Year_of_Release + "<br/>" +
      "Genre: " + game.Genre + "<br/>" +
      "Publisher: " + game.Publisher + "<br/>" +
      "Global Sales: " + game.Global_Sales + "<br/>" +
      "Critic Score: " + game.Critic_Score + "</div>");
    self.setTooltipPosition(self, tooltip);

    d3.select("#game_info").style("text-align", "left")
                           .style("padding-left", "17px");

    tooltip.transition()
           .duration(400)
           .style("opacity", 1)
           .style("width", "200px")
           .style("height", "auto");

  }

  // Event Handler when we pass the mouse over a circle
  onMouseOverEventHandler(context, self, game, tooltip) {
    if (!d3.select(context).classed("selected")) {
      // Make the circle swell when the mouse is on it
      d3.select(context)
        .transition()
        .duration(500)
        .attr("r", 2 * self.radius)
        .style("cursor", "pointer");

      // Set tooltip transition
      tooltip.transition()
              .duration(400)
              .style("opacity", 0.7)
              .style("width", "100px");

      // Set tooltip's text
      tooltip.html(game.Name);
      self.setTooltipPosition(self, tooltip);

      // Set tooltip's properties
      tooltip.style("width", "100px");
    }
  }

  // Event Handler when the mouse leaves the area of a circle
  onMouseOutEventHandler(context, self, tooltip) {
    if (!d3.select(context).classed("selected")) {
      d3.select(context)
        .transition()
        .duration(700)
        .attr("r", self.radius);

      tooltip.transition()
        .duration(400)
        .style("opacity", 0.0)
        .style("width", "40px");

      tooltip.style("height", "auto");
    }
  }

  // Small helper function to set tooltip's position
  setTooltipPosition(self, tooltip) {
    tooltip.style("left", (d3.event.pageX - self.padding) + "px")
           .style("top", (d3.event.pageY - self.padding) + "px");
  }

  // Compute the average score and sales by Publisher
  computeMeanPublishers(newData) {

    // Group our games by publishers
    var groupedByPublishers = newData.reduce(function(acc, game) {
        (acc[game['Publisher']] = acc[game['Publisher']] || []).push(game);
        return acc;
      }, {});

    var publishersAverage = []
    for(let publisher of Object.keys(groupedByPublishers)) {

      // Initialize our values
      let globalSales = 0.0;
      let globalSalesCounter = 0;
      let globalSalesAverage = 0.0;

      let criticScoresCounter = 0;
      let criticScoresAverage = 0.0;

      // Get the list of games from that publisher
      var gamesByPublisher = groupedByPublishers[publisher];
      //console.log(publisher + " " + gamesByPublisher[0].Name + "\n");

      globalSales = gamesByPublisher.reduce(function(acc, game) {
        globalSalesCounter += 1;
        return acc + parseFloat(game.Global_Sales);
      }, 0.0)

      globalSalesAverage = globalSales/globalSalesCounter;

      criticScoresAverage = gamesByPublisher.reduce(function(acc, game) {
        criticScoresCounter += 1;
        return acc + parseFloat(game.Critic_Score);
      }, 0.0)/ criticScoresCounter;

      publishersAverage.push([publisher, globalSalesAverage, criticScoresAverage]);
    }

    return publishersAverage;

    //console.log("globalSalesAverage : " + publishersAverage[0][1] + " criticScoresAverage: " + publishersAverage[0][2]);
  }

  // Return the mean coordinates corresponding to a certain game
  getMeanPublisherCoords(publishersAverage, game) {
    for(let publisher of publishersAverage) {
      if(publisher[0] == game.Publisher) {
        return [publisher[1], publisher[2]];
      }
    }
  }
}
