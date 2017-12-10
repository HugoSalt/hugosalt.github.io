
export default class BrandBarChart {

  constructor(parent, container_id, name, data) {
    this.container_id = container_id
    this.margin = {top: 5, right: 20, bottom: 5, left: 60}
    this.svg_width = 140
    this.svg_height = 140
    this.height = this.svg_width - this.margin.top - this.margin.bottom
    this.width = this.svg_height - this.margin.left - this.margin.right
    this.svg = d3.select('#' + container_id)
                 .append("svg")
                 .attr("id", "svg_" + container_id)
                 .attr("class", "brand_chart brand_chart_selected")
                 .attr("width", this.svg_width)
                 .attr("height", this.svg_height)

    let svg = this.svg
    /*this.svg.on("click", function() {
                   let classList = d3.select('#svg_' + container_id)[0][0].classList
                   if (classList.contains('brand_chart_selected')) {
                     svg.attr('class', 'brand_chart brand_chart_not_selected')
                     parent.update_console(container_id, false)
                   }
                   else {
                     svg.attr('class', 'brand_chart brand_chart_selected')
                     parent.update_console(container_id, true)
                   }
                 })*/

    this.brand_bar_width = 150
    this.bar_svg = d3.select('#' + container_id)
                     .append("svg")
                     .attr("class", "brand_bar")
                     .attr("width", this.brand_bar_width)
                     .attr("height", this.svg_height)

    this.group = this.svg.append('g')
                         .attr("transform",
                                "translate(" + this.margin.left + "," + 20 + ")");

    this.x_group = this.group.append("g")
    this.y_group = this.group.append("g")

    /*brand_name.on("mouseover", function() {
      if (brand_name[0][0].classList.contains('brand_title_selected')) {
        brand_name.attr('class', 'brand_title_selected brand_title_hovered')
      }
      else {
        brand_name.attr('class', 'brand_title_not_selected brand_title_hovered')
      }
    })
    .on("mouseout", function() {
      if (brand_name[0][0].classList.contains('brand_title_selected')) {
        brand_name.attr('class', 'brand_title_selected')
      }
      else {
        brand_name.attr('class', 'brand_title_not_selected')
      }
    })
    .on("click", function () {
      if (brand_name[0][0].classList.contains('brand_title_selected')) {
        brand_name.attr('class', 'brand_title_not_selected brand_title_hovered')
      }
      else {
        brand_name.attr('class', 'brand_title_selected brand_title_hovered')
      }
    })*/


    let brand_name = this.svg.append("text")
                             .attr("class", "brand_title_selected")
                             .attr("x", (this.svg_width / 2))
                             .attr("y", 12 + this.margin.top)
                             .attr("text-anchor", "middle")
                             .text(name)

    brand_name.on("mouseover", function() {
      if (brand_name[0][0].classList.contains('brand_title_selected')) {
        brand_name.attr('class', 'brand_title_selected brand_title_hovered')
      }
      else {
        brand_name.attr('class', 'brand_title_not_selected brand_title_hovered')
      }
    })
    .on("mouseout", function() {
      if (brand_name[0][0].classList.contains('brand_title_selected')) {
        brand_name.attr('class', 'brand_title_selected')
      }
      else {
        brand_name.attr('class', 'brand_title_not_selected')
      }
    })
    .on("click", function () {
      let classList = d3.select('#svg_' + container_id)[0][0].classList
      if (classList.contains('brand_chart_selected')) {
        svg.attr('class', 'brand_chart brand_chart_not_selected')
        brand_name.attr('class', 'brand_title_not_selected brand_title_hovered')
        parent.update_brand(container_id, false)
      }
      else {
        svg.attr('class', 'brand_chart brand_chart_selected')
        brand_name.attr('class', 'brand_title_selected brand_title_hovered')
        parent.update_brand(container_id, true)
      }
    })
  }

  update(newData, scoreBrand, maxBrand) {
    this.data = newData
    this.consoles_selected = Array(this.data.length).fill(true)
    this.height = 12 * this.data.length + 60 - this.margin.top - this.margin.bottom
    this.svg.attr("height", this.height)
    this.bar_svg.attr("height", this.height)
    this.svg_height = this.height


    let x = d3.scale.linear().range([0, this.width]);
    let y = d3.scale.ordinal().rangeRoundBands([0, this.height-20], 0.1)

    let xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom")
                      .ticks(2);

    let yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .outerTickSize(0)

    x.domain([0, d3.max(this.data, function(d) { return d[1]; })]);
    y.domain(this.data.map(function(d) { return d[0]; }));

    this.x_group.attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(xAxis)

    this.y_group.attr("class", "y axis")
                .call(yAxis)


    let width = this.width

    this.group.selectAll(".rect_bar")
              .remove()

    this.bar_svg.selectAll(".rect_brand_bar")
              .remove()

    this.group.selectAll("bar").data(this.data)
                .enter()
                .append("rect")
                .attr('class', 'rect_bar')
                .style("fill", "steelblue")
                .attr("x", 0)
                .attr("height", 10)
                .attr("y", function(d) { return y(d[0]) +y.rangeBand()/2 - 5; })
                .attr("width", function(d) { return x(d[1]); })

    this.bar_svg.append("rect")
                .attr('class', 'rect_brand_bar')
                .style("fill", "steelblue")
                .attr("x", 0)
                .attr("height", this.svg_height)
                .attr("y", 0)
                .attr("width", this.brand_bar_width * (scoreBrand/maxBrand))
  }
}
