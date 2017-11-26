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
  * The functions below are used to filter our data given a particular feature.
  * TODO : implement filter methods and update
  */

  //
  setGenre(genres) {
    this.genres = genres;
    this.filteredData = this.data.filter();
    this.updateComponents();
  }

  setPlatform(platforms) {
    this.platforms = platforms;
    this.filteredData = this.data.filter();
    this.updateComponents();
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    this.filteredData = this.data.filter();
    this.updateComponents();
  }

  setPublisher(publishers) {
    this.publishers = publishers;
    this.filteredData = this.data.filter();
    this.updateComponents();
  }

  updateComponents() {
    for(let component of components_to_update) {
      component.update(this.filteredData);
    }
  }
}
