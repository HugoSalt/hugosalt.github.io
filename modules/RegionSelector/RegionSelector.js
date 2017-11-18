import * as d3 from "d3";

export default class RegionSelector {

  constructor(container_id) {
    this.container_id = container_id;
    let container = document.getElementById(container_id);
    // Create one button for each region
    for (let region of ["WORLD", "NA", "EU", "JP", "OTHER"]) {
      let btn = document.createElement("button");
      btn.id = region + "_button"
      btn.classList.add('region_selector_button');
      btn.classList.add('col-xs');
      btn.style['background-image'] = `url(./modules/RegionSelector/${region}.svg)`
      btn.onclick = () => this.toggle(region)
      container.appendChild(btn);
    }
    // Initially WORLD is selected
    this.toggle("WORLD")
  }

  // Region is either : "WORLD","NA","EU","JP" or "OTHER"
  toggle(region) {
    this.selected_region = region;
    // Deslect all buttons
    for (let region of ["WORLD", "NA", "EU", "JP", "OTHER"]) {
      let button = document.querySelector(`#${this.container_id} #${region}_button`)
      button.classList.remove("selected")
    }
    // Select button
    let button = document.querySelector(`#${this.container_id} #${region}_button`)
    button.classList.add("selected")
    // Notify with callback
    this.selectedRegion(region)
  }

  // Callback called when a region is selected
  selectedRegion(region) {}

}
