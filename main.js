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
  // Set up console popularity over years
  // ---------------------------------------------------------------------------
  // Set up region select
  let consoleWarRegionSelector = new RegionSelector("console_war_region_selector")
  // Get data
  let platformList = ["NES", "SNES", "N64", "GC", "Wii", "WiiU", "GB", "DS", "GBA", "3DS", "PS", "PS2", "PS3", "PS4", "PSP", "2600", "X360", "XOne", "XB", "PC"];
  let console_pop_data = dataProcessor.getConsolePopularityOverYears("EU", platformList);
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
    "PS4": "#067dc2",
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

  // Set Up Graph
  let consolePopularityYears = new StackedAreaChart("consolePopularityYears_container", "Year","Sales", console_pop_data, types, [platformList], colors, order_stack);

}
