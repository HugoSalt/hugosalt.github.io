// Inspired from http://chimera.labs.oreilly.com/books/1230000000345/
import * as d3 from "d3";


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
    self.padding = {
      top: 10,
      right: 2,
      bottom: 10,
      left: 38
    }
    //self.width = 860;
    let container_width = document.getElementById("scatterPlot_container").offsetWidth;
    self.width = container_width - self.padding.right - self.padding.left;
    self.height = 470;

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
    //self.xAxis;
    //self.yAxis;

    //self.circles;

    // -------------------------------------------------------------------------
    //     Create our SVG canvas and its components
    // -------------------------------------------------------------------------

    // Initialize an invisible tooltip used to display game's informations
    self.tooltip = d3.select('body')
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0.0);

    // Initialize the button to compute the Publishers' average
    self.publishersButton = d3.select("#" + "individual_brands_barChart_container")
      .append('g')
      .attr("class", "publishers_button")
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
      .attr("height", 150);


    let x_offset = 30;
    let y_offset = 15;
    let publishers = Object.keys(self.colorsPublishers);

    for (let publisher of publishers) {
      let legend_elem = self.legendPublishers.append("text")
                                         .text(publisher)
                                         .style("fill", "black");

      let elem_width = legend_elem.node().getBBox().width

      if (x_offset + elem_width > self.width) {
        x_offset = 30
        y_offset += 20
      }

      legend_elem.attr("x", x_offset)
                 .attr("y", y_offset)

      self.legendPublishers.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", x_offset - 15)
        .attr("y", y_offset-10)
        .style("fill", function() {
          return (self.colorsPublishers[publisher]);
        });

      x_offset += elem_width + 40
    }

    self.legendPublishers.attr("height", y_offset + 25)
    let pixel_height = 620 - 150 + (y_offset + 25)
    d3.select("#scatterPlot_container")
      .style("height", pixel_height + "px")

    // Create groups for our axis
    self.x_group = self.svg.append("g");
    self.y_group = self.svg.append("g");
  }

  // Update function that is called each time we change a component of our ScatterPlot
  update(newData) {
    // Create X axis
    let self = this
    self.x_group.selectAll('.label')
                .remove()
    self.y_group.selectAll('.label')
                .remove()
    // -------------------------------------------------------------------------
    //     Bring everything we need from the constructor in this function
    // -------------------------------------------------------------------------

    self.data = newData;

    let colorsPublishers = self.colorsPublishers;

    // To compute Publisher's mean
    let publishersButton = self.publishersButton;
    let publishersMeanActivated = false;

    // The tooltip used to show informations about games
    var tooltip = self.tooltip;

    // -------------------------------------------------------------------------
    //     Compute Scaling functions
    // -------------------------------------------------------------------------

    // Compute scale of x
    let xScale = d3.scaleLog()
                    .base(2)
                    .domain([0.01, (self.data.length > 0)? d3.max(self.data, function(game) {
                      return game.Global_Sales;
                    }) : 0])
                    .range([self.padding.left, self.width])
                    .nice()

    // Compute scale of y
    let yScale = d3.scaleLinear()
      .domain([0, (self.data.length > 0) ? d3.max(self.data, function(game) {
        return game.Critic_Score;
      }) : 0])
      .range([self.height - self.padding.bottom, self.padding.top])
      .nice();

    // Compute scale of radius
    let rScale = d3.scaleLinear()
      .domain([0, (self.data.length > 0) ?
        d3.max(self.data, function(game) {
          return game.Global_Sales;
        }) : 0
      ])
      .range([1, 20])
      .clamp(true);

    // Compute scale of opacity
    /*let oScale = d3.scaleLinear()
      .domain([0, d3.max(self.data, function(game) {
        return game.Global_Sales;
      })])
      .range([0, 1])
      .clamp(true);*/

    // -------------------------------------------------------------------------
    //     Set up the axis
    // -------------------------------------------------------------------------


    self.xAxis = d3.axisBottom(xScale)
                 .ticks(self.nbXticks)
                 .tickFormat(d3.format(".2f"));
    self.yAxis = d3.axisLeft(yScale)
      .ticks(self.nbYticks);

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
      .attr("x", 130)
      .attr("y", 15)
      .text(self.y_name)
      .style("fill", "black");

    // -------------------------------------------------------------------------
    //     Create the circles for each game
    // -------------------------------------------------------------------------

    // Create a circle for each game
    // Each game is identified uniquely with its NAME
    self.circles = self.svg.selectAll(".circle")
      .data(newData, function(game) {
        return game.Name.replace(/\s/g, '');
      });

    self.meanCircles = self.svg.selectAll(".meanCircle").data([], function(publisher) {
      return publisher[0];
    });

    self.meanCircles.exit()
      .transition()
      .delay(function(game) {
        return Math.random() * 1000;
      })
      .duration(1500)
      .attr("r", 0)
      .remove();

    // Remove old circles when updating
    self.circles.exit()
      .style("opacity", 1)
      // Add a falling and fading transition animation
      .transition()
      .delay(function(d) {
        return Math.random() * 1000;
      })
      .duration(500)
      /*.attr("cy", function(game) {
        return yScale(0);
      })*/
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
        return (colorsPublishers[game.Publisher] == undefined) ? "grey" : colorsPublishers[game.Publisher];
      })
      .attr("opacity", function(game) {
        return (colorsPublishers[game.Publisher] == undefined) ? 0.2 : 1;
      });

    // Set the current circles position & make them move when the data is updating
    self.circles.transition()
      .delay(function(d) {
        return Math.random() * 1000;
      })
      .duration(2000)
      .style("opacity", 1)
      .attr("cx", function(game) {
        return xScale(game.Global_Sales);
      })
      .attr("cy", function(game) {
        return yScale(game.Critic_Score);
      })
      .attr("fill", function(game) {
        return (colorsPublishers[game.Publisher] == undefined) ? "grey" : colorsPublishers[game.Publisher];
      })
      .attr("opacity", function(game) {
        return (colorsPublishers[game.Publisher] == undefined) ? 0.2 : 1;
      });;


    // -------------------------------------------------------------------------
    //     Add the zoom feature
    // -------------------------------------------------------------------------

    // Inspired from https://bl.ocks.org/rutgerhofste/5bd5b06f7817f0ff3ba1daa64dee629d
    let zoomBeh = d3.zoom().on("zoom", function() {

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
      self.svg.selectAll(".circle").attr("cx", function(game) {
          return new_xScale(game.Global_Sales);
        })
        .attr("cy", function(game) {
          return new_yScale(game.Critic_Score);
        })

      //.attr("transform", d3.event.transform);

      self.svg.selectAll(".meanCircle").attr("cx", function(publisher) {
          return new_xScale(publisher[1]);
        })
        .attr("cy", function(publisher) {
          return new_yScale(publisher[2]);
        });

    });

    // Call the zoom feature
    self.svg.call(zoomBeh);

    // -------------------------------------------------------------------------
    //     Create the big circles for each publisher
    // -------------------------------------------------------------------------

    // Compute the current publishers' average
    // Format : [Name, globalSalesAverage, criticScoresAverage]
    let publishersAverage = self.computeMeanPublishers(self.data);

    // Publishers Button's events
    publishersButton.on("mouseover", function() {
        d3.select(this).attr("class", "publishers_button_hovered");
      })
      .on("mouseout", function() {
        d3.select(this).attr("class", "publishers_button");
      })
      .on("click", function() {
        d3.select(this)
          .transition()
          .duration(50)
          .attr("class", "publishers_button_pressed")
          .transition()
          .duration(50)
          .attr("class", "publishers_button_hovered");

        d3.select(this)
          .select('g')
          .html("Display each game again");

        if (publishersMeanActivated == false) {
          publishersMeanActivated = true;
          // Move the current little circles to their mean
          self.svg.selectAll(".circle").transition()
            .delay(function() {
              return Math.random() * 1000;
            })
            .duration(2000)
            .attr("cx", function(game) {
              return xScale(self.getMeanPublisherCoords(publishersAverage, game)[0]);
            })
            .attr("cy", function(game) {
              return yScale(self.getMeanPublisherCoords(publishersAverage, game)[1]);
            })
            .style("opacity", 0);

          // Create one circle per Publisher
          // Make the publisher circles disappear
          self.meanCircles = self.svg.selectAll(".meanCircle").data(publishersAverage, function(publisher) {
            return publisher[0];
          });
          // Create a circle for each publisher
          // Each publisher is identified uniquely with its NAME
          self.meanCircles.enter()
            .append("circle")
            .attr("class", "meanCircle")
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
            .duration(2000)
            .attr("r", function(publisher) {
              return rScale(publisher[3]);
            })
            .attr("fill", function(publisher) {
              return (colorsPublishers[publisher[0]] == undefined) ? "grey" : colorsPublishers[publisher[0]];
            })
            .style("opacity", function(publisher) {
              return (colorsPublishers[publisher[0]] == undefined) ? 0.35 : 1;
            });

        } else {
          publishersMeanActivated = false;
          d3.select(this).html("Compute Average of Publishers");

          // Move the current little circles to their original position
          self.update(newData);
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
    d3.selectAll(".selected")
      .transition()
      .duration(400)
      .attr("r", self.radius);
    d3.selectAll(".selected").classed("selected", false);

    // Select current item
    d3.select(context).classed("selected", true);

    d3.select(context).transition()
      .duration(700)
      .attr("r", 2 * self.radius)
      .style("cursor", "none");

    const numberWithCommas = (x) => {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
      return parts.join(".");
    }

    // Display further informations about that game
    tooltip.html(game.Name.bold().italics() + "<br/>" +
      "<br/><div id=\"game_info\">Year of Release: " + game.Year_of_Release + "<br/>" +
      "Genre: " + game.Genre + "<br/>" +
      "Platform: " + game.Platform + "<br/>" +
      "Publisher: " + game.Publisher + "<br/>" +
      "Platform: " + game.Platform + "<br/>" +
      "Global Sales: " + game.Global_Sales + "<br/>" +
      "Critic Score: " + game.Critic_Score + "</div>");
    self.setTooltipPosition(self, tooltip);

    d3.select("#game_info").style("text-align", "left")
      .style("padding-left", "17px");

    tooltip
      .style("width", "200px")
      .transition()
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
        .style("opacity", 0.8)
        .style("width", "100px");

      // Set tooltip's text
      tooltip.html(game.Name);
      self.setTooltipPosition(self, tooltip);
    }
  }

  // Event Handler when the mouse leaves the area of a circle
  onMouseOutEventHandler(context, self, tooltip) {
    d3.selectAll(".selected")
      .transition()
      .duration(400)
      .attr("r", self.radius);
    d3.selectAll(".selected").classed("selected", false);
    if (!d3.select(context).classed("selected")) {
      d3.select(context)
        .transition()
        .duration(700)
        .attr("r", self.radius);

      tooltip.transition()
        .duration(400)
        .style("opacity", 0.0)
        .transition()
        .duration(1)
        .style("width", "100px")
        .style("height", "auto");
    }
  }

  // Small helper function to set tooltip's position
  setTooltipPosition(self, tooltip) {
    tooltip.style("left", (d3.event.pageX - 120) + "px")
           .style("top", (d3.event.pageY - self.padding.top -10) + "px");
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
    for (let publisher of Object.keys(groupedByPublishers)) {

      // Initialize our values
      let globalSales = 0.0;
      let globalSalesCounter = 0;
      let globalSalesAverage = 0.0;

      let criticScoresCounter = 0;
      let criticScoresAverage = 0.0;

      let gamesCounter = 0;

      // Get the list of games from that publisher
      var gamesByPublisher = groupedByPublishers[publisher];

      globalSales = gamesByPublisher.reduce(function(acc, game) {
        globalSalesCounter += 1;
        gamesCounter += 1;
        return acc + parseFloat(game.Global_Sales);
      }, 0.0)

      globalSalesAverage = globalSales / globalSalesCounter;

      criticScoresAverage = gamesByPublisher.reduce(function(acc, game) {
        criticScoresCounter += 1;
        return acc + parseFloat(game.Critic_Score);
      }, 0.0) / criticScoresCounter;

      publishersAverage.push([publisher, globalSalesAverage, criticScoresAverage, gamesCounter]);
    }
    return publishersAverage;
  }

  // Return the mean coordinates corresponding to a certain game
  getMeanPublisherCoords(publishersAverage, game) {
    for (let publisher of publishersAverage) {
      if (publisher[0] == game.Publisher) {
        return [publisher[1], publisher[2]];
      }
    }
  }
}
