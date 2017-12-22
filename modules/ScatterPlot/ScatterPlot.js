// Inspired from http://chimera.labs.oreilly.com/books/1230000000345/
// un scatterplot zoomable qui serait joli à faire : http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
import * as d3 from "d3";

/*

  TODO : Position PublisherMeanButton correctly
  TODO : Add a legend for Publishers
  TODO : Add color for Publishers in tooltip when clicking
*/

export default class ScatterPlot {

  constructor(container_id, x_name, y_name) {

    // We use "self" so we won't be confused when using "this" everywhere
    let self = this;

    // Our data is empty at the beginning
    self.data = [];

    // -------------------------------------------------------------------------
    //     Set up parameters of our Scatter Plot
    // -------------------------------------------------------------------------

    // SVG's parameters
    self.padding = {top: 10, right: 5, bottom: 10, left: 35}
    //self.width = 860;
    let container_width = document.getElementById("scatterPlot_container").offsetWidth;
    self.width = container_width - self.padding.right - self.padding.left;
    self.height = 600;

    // Circles' parameters
    self.radius = 3;

    // Axis' parameters
    self.nbXticks = 20;
    self.nbYticks = 10;
    self.x_name = x_name;
    self.y_name = y_name;

    // Colors for top 20 Publishers
    self.colorsPublishers = {
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

    // Set up the axis
    self.xAxis;
    self.yAxis;

    // -------------------------------------------------------------------------
    //     Create our SVG canvas and its components
    // -------------------------------------------------------------------------

    self.circles;

    // Initialize an invisible tooltip used to display game's informations
    self.tooltip = d3.select("#" + container_id)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0.0);

    // Initialize the button to compute the Publishers' average
    self.publishersButton = d3.select("#" + "individual_brands_barChart_container")
                              .append("div")
                              .attr("class", "publishers_button")
                              .append('g')
                              .html("Compute Average of Publishers");

    // Create the main SVG
    self.svg = d3.select('#' + container_id)
                  .append("svg")
                  .attr("width", self.width + self.padding.left + self.padding.right)
                  .attr("height", self.height + self.padding.bottom + self.padding.top)
                  .style("cursor", "move");

    // -------------------------------------------------------------------------
    //     Create the legend for Publishers
    // -------------------------------------------------------------------------

    self.legendPublishers = d3.select('#' + container_id)
                              .append("svg")
                              .attr("width", self.width + self.padding.left + self.padding.right)
                              .attr("height", 100);


    let idx = 0;
    let col = 0;
    let x_offset = 20;
    let y_offset = 15;
    let line_number = 1;
    let name_length = 0;
    let padding = 0;

    let publishers = Object.keys(self.colorsPublishers);

    for(let publisher of publishers) {

      if(x_offset + padding > self.width) {
        x_offset = 20;
        y_offset += 20;
        line_number += 1;
        col = 0;
      }

      name_length = publisher.length;

      if(name_length <= 10) {
        padding = 100;
      } else if(name_length > 10 && name_length < 20) {
        padding = 190;
      } else {
        padding = 250;
      }

      if(line_number == 2 || line_number == 4) {
        x_offset += 40;
      }

      self.legendPublishers.append("text")
                            .attr("x", x_offset)
                            .attr("y", 10 + y_offset)
                            .text(publisher)
                            .style("fill", "black");

      self.legendPublishers.append("rect")
                          .attr("width", 10)
                          .attr("height", 10)
                          .attr("x", x_offset - 15)
                          .attr("y", y_offset)
                          .style("fill", function() {
                            return (self.colorsPublishers[publisher]);
                          });
      idx += 1;
      col += 1;
      x_offset += padding + 10;
    }

    // Create groups for our axis
    self.x_group = self.svg.append("g");
    self.y_group = self.svg.append("g");
  }

  // Update function that is called each time we change a component of our ScatterPlot
  update(newData) {

    // -------------------------------------------------------------------------
    //     Bring everything we need from the constructor in this function
    // -------------------------------------------------------------------------

    let self = this;
    self.data = newData;

    let colorsPublishers = self.colorsPublishers;

    // To compute Publisher's mean
    let publishersButton = self.publishersButton;
    let publishersMeanActivated = false;

    // The tooltip used to show informations about games
    var tooltip = self.tooltip;

    // Boolean used to know if we are zoomed or not
    let zoomed = false;

    // -------------------------------------------------------------------------
    //     Compute Scaling functions
    // -------------------------------------------------------------------------

    // Compute scale of x
    let xScale = d3.scaleLinear()
                    .domain([0, (self.data.length > 0)? d3.max(self.data, function(game) {
                      return game.Global_Sales;
                    }) : 0])
                    .range([self.padding.left, self.width])
                    .nice();

    // Compute scale of y
    let yScale = d3.scaleLinear()
                    .domain([0, (self.data.length > 0)? d3.max(self.data, function(game) {
                      return game.Critic_Score;
                    }) : 0])
                    .range([self.height - self.padding.bottom, self.padding.top])
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

    // -------------------------------------------------------------------------
    //     Add the zoom feature
    // -------------------------------------------------------------------------

    // Compute new scale functions for zoom
    let zoomed_xScale;
    let zoomed_yScale;

    // -------------------------------------------------------------------------
    //     Set up the axis
    // -------------------------------------------------------------------------

    self.xAxis = d3.axisBottom(xScale)
                 .ticks(self.nbXticks);
    self.yAxis = d3.axisLeft(yScale)
                .ticks(self.nbYticks);

    self.x_group.selectAll(".label").remove;
    self.y_group.selectAll(".label").remove;

    // Create X axis
    self.x_group.attr("class", "x axis")
                .attr("transform", "translate(0," + (self.height - self.padding.bottom) + ")")
                .call(self.xAxis)
                // Add a label to the axis
                .append("text")
                .attr("class", "label")
                .attr("x", self.width - self.padding.right)
                .attr("y", -15)
                .style("text-anchor", "end")
                .text(self.x_name)
                .style("fill", "black");

    // Create Y axis
    self.y_group.attr("class", "y axis")
                .attr("transform", "translate(" + self.padding.left + ",0)")
                .call(self.yAxis)
                // Add a label to the axis
                .append("text")
                .attr("class", "label")
                .attr("x", 100)
                .attr("y", 30)
                .text(self.y_name)
                .style("fill", "black");

    // -------------------------------------------------------------------------
    //     Create the circles for each game
    // -------------------------------------------------------------------------

    // Create a circle for each game
    // Each game is identified uniquely with its NAME
    self.circles = self.svg.selectAll("circle").data(newData);

    // Remove old circles when updating
    self.circles.exit()
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
    self.circles.enter()
      .append("circle")
      .attr("class", "circle")
      // Initialize Mouse Events
      .on("mouseover", function(game) {
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
      })
      // Position the circles
      .attr("cx", function(game) {
        if(zoomed) {
          return zoomed_xScale(game.Global_Sales);
        } else {
          return xScale(game.Global_Sales);
        }
      })
      .attr("cy", function(game) {
        if(zoomed) {
          return zoomed_xScale(game.Critic_Score);
        } else {
          return yScale(game.Critic_Score);
        }
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

    // Set the current circles position & make them move when the data is updating
    self.circles.transition()
      .delay(function(d) {
        return Math.random() * 1000;
      })
      .duration(2000)
      .style("opacity", 1)
      .attr("cx", function(game) {
        if(game.Global_Sales != undefined) {
          return xScale(game.Global_Sales);
        }
      })
      .attr("cy", function(game) {
        if(game.Critic_Score != undefined) {
          return yScale(game.Critic_Score);
        }
      });

    // Inspired from https://bl.ocks.org/rutgerhofste/5bd5b06f7817f0ff3ba1daa64dee629d
    let zoomBeh = d3.zoom().on("zoom", function() {
      zoomed = true;

      let new_xScale = d3.event.transform.rescaleX(xScale);
      let new_yScale = d3.event.transform.rescaleY(yScale);

      // Update the axis
      self.x_group.transition()
                  .duration(500)
                  .call(self.xAxis.scale(new_xScale));
      self.y_group.transition()
                  .duration(500)
                  .call(self.yAxis.scale(new_yScale));

      // Update circles
      self.svg.selectAll("circle")
             .attr("transform", d3.event.transform);

      zoomed_xScale = new_xScale;
      zoomed_yScale = new_yScale;
    });

    // Call the zoom feature
    self.svg.call(zoomBeh);

    // -------------------------------------------------------------------------
    //     Create the big circles for each publisher
    // -------------------------------------------------------------------------

    // Compute the current publishers' average
    // Format : [Name, globalSalesAverage, criticScoresAverage]
    let publishersAverage = self.computeMeanPublishers(self.data);

    // Create a circle for each publisher
    // Each publisher is identified uniquely with its NAME
    var meanCircles = self.svg.selectAll("circle")
                              .data(publishersAverage, function(publisher) {
                                return publisher[0];
                              })
                              .attr("class", "meanCircle");
    // Publishers Button's events
    publishersButton.on("mouseover", function() {
                      d3.select(this).style("cursor", "pointer");
                    })
                    .on("click", function() {
                      if(publishersMeanActivated == false) {
                        publishersMeanActivated = true;
                        // Move the current little circles to their mean
                        self.svg.selectAll("circle") .transition()
                                .delay(function() {
                                  return Math.random() * 1000;
                                })
                                .duration(3000)
                                .attr("cx", function(game) {
                                  return xScale(self.getMeanPublisherCoords(publishersAverage, game)[0]);
                                })
                                .attr("cy", function(game) {
                                  return yScale(self.getMeanPublisherCoords(publishersAverage, game)[1]);
                                })
                                .style("opacity", 0);

                        // Create one circle per Publisher
                        meanCircles.enter()
                                    .append("circle")
                                    .on("mouseover", function(publisher) {
                                      self.onMouseOverPublisherEventHandler(this, self, publisher, tooltip);
                                    })
                                    .on("mousemove", function() {
                                      self.setTooltipPosition(self, tooltip);
                                    })
                                    .on("mouseout", function() {
                                      self.onMouseOutPublisherEventHandler(this, self, tooltip);
                                    })
                                    .on("click", function(publisher) {
                                      self.onClickPublisherEventHandler(this, self, publisher, tooltip);
                                    })
                                    // Add transition and positioning
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
                                      return (colorsPublishers[publisher[0]] == undefined)? 0.5 : 1;
                                    });

                      } else {
                        publishersMeanActivated = true;
                      }
                    });

  }

  // ---------------------------------------------------------------------------
  //    Helpers Functions
  // ---------------------------------------------------------------------------

    // -----------------------------------------//
    //     Mouse's events for small circles     //
    // -----------------------------------------//

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
    tooltip.style("left", (d3.event.pageX - self.padding.left) + "px")
           .style("top", (d3.event.pageY - self.padding.top) + "px");
  }

    // -----------------------------------//
    //     Publishers Average helpers     //
    // -----------------------------------//

  // Event Handler when we pass the mouse over a circle
  onMouseOverPublisherEventHandler(context, self, publisher, tooltip) {
    // Change cursor
    d3.select(context).style("cursor", "pointer");

    // Set tooltip's text and position
    tooltip.html(publisher[0]);
    self.setTooltipPosition(self, tooltip);

    // Set tooltip transition
    tooltip.transition()
            .duration(400)
            .style("opacity", 0.7)
            .style("width", "100px");
  }

  // Event Handler when the mouse leaves the area of a circle
  onMouseOutPublisherEventHandler(context, self, tooltip) {
    tooltip.transition()
      .duration(400)
      .style("opacity", 0.0)
      .style("width", "40px");

    tooltip.style("height", "auto");
  }

  onClickPublisherEventHandler(context, self, publisher, tooltip) {

    // Display further informations about that publisher
    tooltip.html(publisher[0].bold().italics() + "<br/>" +
      "<br/><div id=\"publisher_info\"><i>Average of Global Sales:</i> " + publisher[1].toFixed(2) + "<br/>" +
      "<i>Average Critical Score:</i> " + publisher[2].toFixed(2) + "</div>");

    // Set tooltip's position
    self.setTooltipPosition(self, tooltip);

    d3.select("#game_info").style("text-align", "left")
                           .style("padding-left", "17px");

    tooltip.transition()
           .duration(400)
           .style("opacity", 1)
           .style("width", "200px")
           .style("height", "auto");

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
