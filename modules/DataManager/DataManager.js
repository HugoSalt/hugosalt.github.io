export default class DataManager {

  constructor(container_id, data, components_to_update) {
    this.data = data;
    this.filteredData = data;
    this.components_to_update = components_to_update;
    this.genres = "any";
    this.platforms = "any";
    this.publishers = "any";
    this.timeInterval = [1980, 2015];
    this.components_to_update();
  }

  /*
  *  The functions below are used to filter our data given a particular
  *  feature.
  *  TODO : implement update methods
  */

  setGenre(genres) {
    this.genres = genres;
    this.filteredData = this.data.filter(genres, "Genre");
    this.updateComponents();
  }

  setPlatform(platforms) {
    this.platforms = platforms;
    this.filteredData = this.data.filter(platforms, "Platform");
    this.updateComponents();
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    this.filteredData = this.data.filter(timeInterval,
      "Year_of_Release"); // TODO: special filter for Years ?
    this.updateComponents();
  }

  setPublisher(publishers) {
    this.publishers = publishers;
    this.filteredData = this.data.filter(publishers, "Publisher");
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
    for(let component of components_to_update) {
      component.update(this.filteredData);
      // TODO: create update() for all components
    }
  }
}
