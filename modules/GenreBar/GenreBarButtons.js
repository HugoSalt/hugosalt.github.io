
export default class GenreBarButtons {

  constructor(container_id, genres, dataManager) {
    this.genres = genres
    this.dataManager = dataManager
    this.genres_selected = []
    for (let i = 0 ; i < this.genres.length ; ++i) {
      this.genres_selected[i] = true
    }
    this.margin = {top: 10, right: 20, bottom: 20, left: 10},
    this.width = 250 - this.margin.left - this.margin.right,
    this.height = 200 - this.margin.top - this.margin.bottom;
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
            .attr("x", function(d, i) {
                return Math.floor(i / 6) * (rect_width + 10)
            })
            .attr("y", function(d, i) {
              return (i%6) * 24
            })
            .attr("width", rect_width)
            .attr("height", rect_height)
            .attr('rx', 10)
            .attr('ry', 10)

    let button_all = this.svg.append('g')
                             .attr('class', 'button_all_none')

    let button_all_rect = button_all.append('rect')
                                    .attr("x", 0)
                                    .attr("y", 6*24 + 6)
                                    .attr("width", rect_width)
                                    .attr("height", rect_height)
                                    .attr('rx', 10)
                                    .attr('ry', 10)
                                    .attr('class', 'button_all_none')

    button_all.on('click', function() {
              self.svg.selectAll('.button_not_selected')
                      .attr('class', 'button_selected')
              button_all.transition()
                  .duration(50)
                  .attr('class', 'button_all_none_selected')
                  .transition()
                  .duration(50)
                  .attr('class', 'button_all_none_hovered')
              for (let i = 0 ; i < genres_length ; ++i) {
                self.update_genre(i, true)
              }
              self.update_genre_list()
            })
            .on('mouseover', function(){
              button_all.attr('class', 'button_all_none_hovered')
              d3.event.stopPropagation();
            })
            .on('mouseout', function(){
              button_all.attr('class', 'button_all_none')
              d3.event.stopPropagation();
            })

    button_all.append('text')
            .attr('class', 'button_all_none_text')
            .text("All")
            .attr("x", function() {
              return (rect_width/2) - (this.getBBox().width/2);
            })
            .attr("y", 16 + 6*24 + 6)

    let button_none = this.svg.append('g')
                              .attr('class', 'button_all_none')

    let button_none_rect = button_none.append('rect')
                                      .attr("x", rect_width + 10)
                                      .attr("y", 6*24 + 6)
                                      .attr("width", rect_width)
                                      .attr("height", rect_height)
                                      .attr('rx', 10)
                                      .attr('ry', 10)
                                      .attr('class', 'button_all_none')

    button_none.on('click', function() {
              self.svg.selectAll('.button_selected')
                      .attr('class', 'button_not_selected')
              button_none.transition()
                  .duration(50)
                  .attr('class', 'button_all_none_selected')
                  .transition()
                  .duration(50)
                  .attr('class', 'button_all_none_hovered')
              for (let i = 0 ; i < genres_length ; ++i) {
                self.update_genre(i, false)
              }
              self.update_genre_list()
            })
            .on('mouseover', function(){
              button_none.attr('class', 'button_all_none_hovered')
              d3.event.stopPropagation();
            })
            .on('mouseout', function(){
              button_none.attr('class', 'button_all_none')
              d3.event.stopPropagation();
            })

    button_none.append('text')
               .attr('class', 'button_all_none_text')
               .text("None")
               .attr("x", function() {
                 return rect_width + 10 + (rect_width/2) - (this.getBBox().width/2);
               })
               .attr("y", 16 + 6*24 + 6)

    let texts = buttons.append('text')
                       .text(function(d) { return d.label })
                       .attr("x", function (d, i) {
                            let text_width = this.getBBox().width
                            let offset = Math.floor(i / 6) * (rect_width + 10)
                            return offset + rect_width/2 - text_width/2; })
                       .attr("y", function(d, i) { return 16+(i%6)*24} )
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
