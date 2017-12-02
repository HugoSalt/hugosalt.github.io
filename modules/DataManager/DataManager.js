export default class DataManager {

  constructor(data, components_to_update, genres, platforms, publishers, timeInterval) {
    this.data = data;
    this.components_to_update = components_to_update;
    this.genres = genres;
    this.platforms = platforms;
    this.publishers = publishers;
    this.timeInterval = timeInterval;
    this.filter();
    this.updateComponents();
  }

  /*
  * The functions below are used to filter our data given a particular feature.
  */

  setGenre(genres) {
    this.genres = genres;
    this.filter();
    this.updateComponents();
  }

  setPlatform(platforms) {
    this.platforms = platforms;
    this.filter();
    this.updateComponents();
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    this.filter();
    this.updateComponents();
  }

  setPublisher(publishers) {
    this.publishers = publishers;
    this.filter();
    this.updateComponents();
  }

  /*
  *  Notify all the components to update themselves by giving them
  *  the new filtered dataset.
  */
  updateComponents() {
    for(let component of this.components_to_update) {
      component.update(this.filteredData);
    }
  }

  /*
    Update filteredData according to the new constraints
  */
  filter() {
    this.filteredData = []
    for (let game of this.data) {
      if (game.Genre != "" &&
          this.genres.includes(game.Genre) &&
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
