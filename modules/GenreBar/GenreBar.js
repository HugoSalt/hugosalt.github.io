
export default class GenreBar {

  constructor(container_id, colors) {
    this.margin = {top: 10, right: 0, bottom: 50, left: 50},
    this.width = 700 - this.margin.left - this.margin.right,
    this.height = 190 - this.margin.top - this.margin.bottom;
    this.svg = d3.select('#' + container_id)
                 .append("svg")
                 .attr("width", this.width + this.margin.left + this.margin.right)
                 .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                 .attr("transform",
                         "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.x_group = this.svg.append("g")
    this.y_group = this.svg.append("g")
    this.colors = colors
    this.data = {}

    this.tip = d3.tip()
                 .attr('class', 'genre_tip')
                 .offset([-10, 0])
                 .html(function(d) {
                   return parseFloat(d[1]*100).toFixed(1) + "%";
                 })
  }

  update(newData) {
    this.data = this.getGenreDistribution(newData)

    //let x = d3.scaleBand().rangeRound([0, this.width]).paddingInner(0.1)
    let x = d3.scale.ordinal().rangeRoundBands([0, this.width], 0.1)
    let y = d3.scale.linear().range([this.height, 0]);

    let xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom")

    let yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .ticks(5);

    x.domain(this.data.map(function(d) { return d[0]; }));
    y.domain([0, d3.max(this.data, function(d) { return d[1]; })]);

    this.svg.call(this.tip);

    this.x_group.attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("dy", function(d, i) {
                  if (i % 2 == 1) {
                    return "2.2em"
                  }
                  return "1em"
                })

    this.y_group.attr("class", "y axis")
                .call(yAxis)

    let height = this.height

    this.svg.selectAll(".rect_bar")
            .remove()

    this.svg.selectAll("bar").data(this.data)
                  .enter()
                  .append("rect")
                  .attr('class', 'rect_bar')
                  .style("fill", "steelblue")
                  .attr("x", function(d) { return x(d[0]); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d[1]); })
                  .attr("height", function(d) { return height - y(d[1]); })
                  .on('mouseover', this.tip.show)
                  .on('mouseout', this.tip.hide)
  }

  /*
    For each genre specified, compute the percentage of existing games with
    respect to all genre specified, such that the sum of each percentage is 1.
  */
  getGenreDistribution(newData) {
      let genre_sort_rule = {
        "Sports": 1,
        "Platform": 2,
        "Racing": 3,
        "Role-Playing": 4,
        "Puzzle": 5,
        "Misc": 6,
        "Shooter": 7,
        "Simulation": 8,
        "Action": 9,
        "Fighting": 10,
        "Adventure": 11,
        "Strategy": 12,
      }

      let data = newData.reduce(
        (genre_list, game) => {
        let found = false
        for (let e of genre_list) {
          if (e[0] == game.Genre) {
            e[1] += 1
            found = true
          }
        }
        if (! found) {
          genre_list.push([game.Genre, 1])
        }
        return genre_list
      }, [])

      for (let e of data) {
        e[1] /= newData.length
      }

      // We sort
      data.sort(function(a, b) {
        return genre_sort_rule[a[0]] - genre_sort_rule[b[0]]
      })

      return data
  }
}
