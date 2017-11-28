export default class DataManager {

  constructor(data, components_to_update, genres, platforms, publishers, timeInterval) {
    this.data = data;
    this.filteredData = data;
    this.components_to_update = components_to_update;
    this.genres = genres;
    this.platforms = platforms;
    this.publishers = publishers;
    this.timeInterval = timeInterval;
    this.updateComponents();
  }

  /*
  * The functions below are used to filter our data given a particular feature.
  */

  //
  setGenre(genres) {
    this.genres = genres;
    this.filteredData = this.filter();
    this.updateComponents();
  }

  setPlatform(platforms) {
    this.platforms = platforms;
    this.filteredData = this.filter();
    this.updateComponents();
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    this.filteredData = this.filter();
    this.updateComponents();
  }

  setPublisher(publishers) {
    this.publishers = publishers;
    this.filteredData = this.filter();
    this.updateComponents();
  }

  updateComponents() {
    for(let component of this.components_to_update) {
      component.update(this.filteredData);
    }
  }

  filter() {
    this.filteredData = []
    for (let game of this.data) {
      if (this.genres.includes(game.Genre) &&
          this.platforms.includes(game.Platform) &&
          this.timeInterval[0] <= game.Year_of_Release &&
          game.Year_of_Release <= this.timeInterval[1] &&
          this.publishers.includes(game.Publisher)) {
            this.filteredData.push(game)
          }
    }
    return this.filteredData
  }
}
