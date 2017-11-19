import * as d3 from "d3";
import StackedAreaChart from "./modules/StackedAreaChart/StackedAreaChart.js"
import DataProcessor from "./modules/DataProcessor/DataProcessor.js";
import Menu from "./modules/Menu/Menu.js";
import Banner from "./modules/Banner/Banner.js";
import RegionSelector from "./modules/RegionSelector/RegionSelector.js"

// Load CSV Data
let data = [];
d3.csv("./data/Video_Games_Sales_as_at_22_Dec_2016.csv", (parsed_data) => {
  parsed_data.forEach((line) => data.push(line));
  initialize();
});

// Load website
function initialize() {

  let dataProcessor = new DataProcessor(data);

  // ---------------------------------------------------------------------------
  // Set up left side menu
  // ---------------------------------------------------------------------------
  let menu = new Menu("menu_container")
  let button = document.getElementById('menu_button')
  button.onclick = () => menu.toggle()

  // ---------------------------------------------------------------------------
  // Set up animated top header
  // ---------------------------------------------------------------------------
  new Banner("banner_container");

  // ---------------------------------------------------------------------------
  // CONSOLE WAR
  // ---------------------------------------------------------------------------
  // Get data
  let platformList = ["NES", "SNES", "N64", "GC", "Wii", "WiiU", "GB", "DS", "GBA", "3DS", "PS", "PS2", "PS3", "PS4", "PSP", "2600", "X360", "XOne", "XB", "PC"];
  let console_release_data = dataProcessor.getConsoleReleaseYears(platformList);
  let types = {};
  for (let console of platformList) types[console] = 'area-spline';
  let colors = {
    "NES": "#632920",
    "SNES": "#6e0f01",
    "N64": "#792215",
    "GC": "#831e0e",
    "Wii": "#932513",
    "WiiU": "#a3200a",
    "GB": "#b9260d",
    "DS": "#d02407",
    "GBA": "#e33316",
    "3DS": "#f54123",
    "PS": "#025485",
    "PS2": "#046195",
    "PS3": "#036eac",
    "PS4": "#0b90dd",
    "PSP": "#0481c9",
    "2600": "#77007a",
    "X360": "#047e09",
    "XOne": "#009506",
    "XB": "#026705",
    "PC": "#606060"
  }
  let order_stack = {
    "NES": 1,
    "SNES": 2,
    "N64": 3,
    "GC": 4,
    "Wii": 5,
    "WiiU": 6,
    "GB": 7,
    "DS": 8,
    "GBA": 9,
    "3DS": 10,
    "PS": 11,
    "PS2": 12,
    "PS3": 13,
    "PS4": 14,
    "PSP": 15,
    "2600": 16,
    "X360": 17,
    "XOne": 18,
    "XB": 19,
    "PC": 20
  }
  // Set Up Release Games Graph
  let consoleReleaseYears = new StackedAreaChart("consoleReleaseYears_container", "Year", "Number of games released that year", 1600, console_release_data, types, [platformList], colors, order_stack);
  // Get Data
  let console_sales_data_WORLD = dataProcessor.getConsoleSalesYears(platformList, "Global");
  let console_sales_data_NA = dataProcessor.getConsoleSalesYears(platformList, "NA");
  let console_sales_data_EU = dataProcessor.getConsoleSalesYears(platformList, "EU");
  let console_sales_data_JP = dataProcessor.getConsoleSalesYears(platformList, "JP");
  let console_sales_data_OTHER = dataProcessor.getConsoleSalesYears(platformList, "Other");
  // Set Up Sales Games Graph
  let consoleSalesYears = new StackedAreaChart("consoleSalesYears_container", "Year", "Sales of games released that year", 350, console_sales_data_WORLD, types, [platformList], colors, order_stack);
  // Set Up Region Selector
  let consoleWarRegionSelector = new RegionSelector("console_sales_region_selector")
  consoleWarRegionSelector.selectedRegion = (region) => {
    switch (region) {
      case "WORLD":
        consoleSalesYears.update(console_sales_data_WORLD)
        break;
      case "NA":
        console.log("NA");
        consoleSalesYears.update(console_sales_data_NA)
        break;
      case "EU":
        console.log("EU");
        consoleSalesYears.update(console_sales_data_EU)
        break;
      case "JP":
        console.log("JP");
        consoleSalesYears.update(console_sales_data_JP)
        break;
      case "OTHER":
      consoleSalesYears.update(console_sales_data_OTHER)
        break;
    }
  }

}
