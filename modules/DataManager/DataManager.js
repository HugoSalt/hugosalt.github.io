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
  * TODO : implement filter methods and update
  */

  //
  setGenre(genres) {
    this.genres = genres;
    this.filteredData = this.filter(this.data);
    this.updateComponents();
  }

  setPlatform(platforms) {
    this.platforms = platforms;
    this.filteredData = this.filter(this.data);
    this.updateComponents();
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    this.filteredData = this.filter(this.data);
    this.updateComponents();
  }

  setPublisher(publishers) {
    this.publishers = publishers;
    this.filteredData = this.filter(this.data);
    this.updateComponents();
  }

  updateComponents() {
    for(let i = 0 ; i < this.components_to_update.length ; ++i) {
      (this.components_to_update[i]).update(this.filteredData);
    }
  }

  filter() {
    this.filteredData = []
    for (let i = 0 ; i < this.data.length ; ++i) {
      if (this.genres.includes(this.data[i].Genre) &&
          this.platforms.includes(this.data[i].Platform) &&
          this.timeInterval[0] <= this.data[i].Year_of_Release &&
          this.data[i].Year_of_Release <= this.timeInterval[1] &&
          this.publishers.includes(this.data[i].Publisher)) {
            this.filteredData.push(this.data[i])
          }
    }
    return this.filteredData
  }

  update(newData) {
    this.data = newData
    this.filteredData = this.filter(this.data)
    updateComponents()
  }
}
