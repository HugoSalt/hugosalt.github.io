
export default class GenreBarButtons {

  constructor(container_id, genres, dataManager) {
    this.genres = genres
    this.dataManager = dataManager
    this.genres_selected = []
    for (let i = 0 ; i < this.genres.length ; ++i) {
      this.genres_selected[i] = true
    }
    this.margin = {top: 20, right: 20, bottom: 50, left: 50},
    this.width = 200 - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.svg = d3.select('#' + container_id)
                 .append("svg")
                 .attr("width", this.width + this.margin.left + this.margin.right)
                 .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                 .attr('id', 'buttons')
                 .attr("transform",
                         "translate(" + this.margin.left + "," + this.margin.top + ")");

    let data = []
    for (let i = 0 ; i < genres.length ; ++i) {
      data.push({label: genres[i], x: 0, y: i*26})
    }

    let genres_length = this.genres.length
    let self = this
    let buttons = this.svg.selectAll('button_not_selected')
                          .data(data)
                          .enter()
                          .append('g')
                          .attr('id', function(d) { return 'button_' + d.label })
                          .attr('class', 'button_selected')
                          .on("click", function(d, i) {
                            let button = d3.select('#button_' + d.label)
                            let classList = button[0][0].classList
                            if (classList.contains('button_not_selected')) {
                              button.attr('class', 'button_selected button_hovered')
                              self.update_genre(i, true)
                            }
                            else {
                              button.attr('class', 'button_not_selected button_hovered')
                              self.update_genre(i, false)
                            }
                            self.update_genre_list()
                          })
                          .on("mouseover", function(d) {
                            let button = d3.select('#button_' + d.label)
                            let classList = button[0][0].classList
                            if (!classList.contains('button_hovered')) {
                              let final_classes = ""
                              classList.forEach(function(e) {
                                final_classes += e
                                final_classes += " "
                              })
                              final_classes += " button_hovered"
                              button.attr('class', final_classes)
                            }
                            d3.event.stopPropagation();
                          })
                          .on("mouseout", function(d) {
                            let button = d3.select('#button_' + d.label)
                            let classList = button[0][0].classList
                            let final_classes = ""
                            classList.forEach(function(e) {
                              if (e != "button_hovered") {
                                final_classes += e
                                final_classes += " "
                              }
                            })
                            final_classes.substring(0, final_classes.length - 1);
                            button.attr('class', final_classes)

                            d3.event.stopPropagation();
                          })

    let rect_width = 100
    let rect_height = 20

    buttons.append('rect')
            .attr("x", 0)
            .attr("y", function(d, i) { return i*24} )
            .attr("width", rect_width)
            .attr("height", rect_height)
            .attr('rx', 10)
            .attr('ry', 10)

    let texts = buttons.append('text')
                       .text(function(d) { return d.label })
                       .attr("x", function (d, i) {
                            let text_width = this.getBBox().width
                            return rect_width/2 - text_width/2; })
                       .attr("y", function(d, i) { return 16+i*24} )
  }

  update_genre(index_genre, value) {
    this.genres_selected[index_genre] = value
  }

  update_genre_list() {
    let new_genres = []
    for (let i = 0 ; i < this.genres.length ; ++i) {
      if (this.genres_selected[i]) {
        new_genres.push(this.genres[i])
      }
    }
    this.dataManager.setGenre(new_genres)
  }
}
