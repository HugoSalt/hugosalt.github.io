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

  /*
  *  Returns a filtered data given a list of selected elements and the
  *  feature evaluated.
  *
  *  => Eg. selectedElements = [EA, Ubisoft, Nintendo, ...]
  *         feature = "Publisher"
  */
  filter(selectedElements, feature) {
    let filteredData = this.data;

    // Keep only games that have as feature the selected elements
    for(selectedElement in selectedElements) {
      filteredData = filteredData.reduce(
        (filteredData, game) => {
          if(game[feature] = selectedElement) { filteredData.push(game); }
          return filteredData;
        }, filteredData);
    }

    return filteredData;
  }

  /*
  *  Notify all the components to update themselves by giving them
  *  the new filterd dataset.
  */
  updateComponents() {
<<<<<<< HEAD
    for(let component of this.components_to_update) {
      component.update(this.filteredData);
=======
    for(let component of components_to_update) {
      component.update(this.filteredData);
      // TODO: create update() for all components
>>>>>>> 63374981ec2ef21545bb81c342ac3e8db09a879e
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
