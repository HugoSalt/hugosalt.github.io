import * as d3 from "d3";
import StackedAreaChart from "./modules/StackedAreaChart/StackedAreaChart.js"
import StackedBarChart from "./modules/StackedBarChart/StackedBarChart.js"
import BarChart from "./modules/BarChart/BarChart.js"
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
  // ------------------------ Releases over years ------------------------------
  // Get data Releases
  let platformList = ["2600", "NES", "SNES", "N64", "GC", "Wii", "WiiU", "GB", "DS", "GBA", "3DS", "PS", "PS2", "PS3", "PS4", "PSP", "X360", "XOne", "XB", "PC"];
  let console_release_data = dataProcessor.getConsoleReleaseYears(platformList);
  let typesConsoles = {};
  for (let platform of platformList) typesConsoles[platform] = 'area-spline';
  let colorsConsole = {
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
  let order_stack_consoles = {
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
  let consoleReleaseYears = new StackedAreaChart("consoleReleaseYears_container", "Year", "Number of games released that year", 1600, console_release_data, typesConsoles, [platformList], colorsConsole, order_stack_consoles);

  //------------------------- Sales over years ---------------------------------
  // Get Data Release
  let console_sales_data_WORLD = dataProcessor.getConsoleSalesYears(platformList, "Global");
  let console_sales_data_NA = dataProcessor.getConsoleSalesYears(platformList, "NA");
  let console_sales_data_EU = dataProcessor.getConsoleSalesYears(platformList, "EU");
  let console_sales_data_JP = dataProcessor.getConsoleSalesYears(platformList, "JP");
  let console_sales_data_OTHER = dataProcessor.getConsoleSalesYears(platformList, "Other");
  // Set Up Sales Games Graph
  let consoleSalesYears = new StackedAreaChart("consoleSalesYears_container", "Year", "Sales of games released that year", 700, console_sales_data_WORLD, typesConsoles, [platformList], colorsConsole, order_stack_consoles);
  // Set Up Region Selector
  let consoleWarRegionSelector = new RegionSelector("console_sales_region_selector")
  consoleWarRegionSelector.selectedRegion = (region) => {
    switch (region) {
      case "WORLD":
        consoleSalesYears.update(console_sales_data_WORLD)
        break;
      case "NA":
        consoleSalesYears.update(console_sales_data_NA)
        break;
      case "EU":
        consoleSalesYears.update(console_sales_data_EU)
        break;
      case "JP":
        consoleSalesYears.update(console_sales_data_JP)
        break;
      case "OTHER":
        consoleSalesYears.update(console_sales_data_OTHER)
        break;
    }
  }
  //----------------------- Genre Sales per Console ----------------------------
  // Get Data Genre
  let genreList = ["Sports", "Platform", "Racing", "Role-Playing", "Puzzle", "Misc", "Shooter", "Simulation", "Action", "Fighting", "Adventure", "Strategy"]
  let console_genre_data = dataProcessor.getConsoleGenreSales(genreList, platformList);
  // Set Up Graph Genre
  let consoleGenreSales = new StackedBarChart("consoleGenre_container", "Consoles", "All-Time Sales", platformList, console_genre_data, [genreList]);
  // Set Up text interactivity
  let sportGamesTextButton = document.getElementById('sport_games_text_button');
  sportGamesTextButton.onclick = () => consoleGenreSales.showOnly("Sports");
  let puzzleGamesTextButton = document.getElementById('puzzle_games_text_button');
  puzzleGamesTextButton.onclick = () => consoleGenreSales.showOnly("Puzzle");
  let shooterGamesTextButton = document.getElementById('shooter_games_text_button');
  shooterGamesTextButton.onclick = () => consoleGenreSales.showOnly("Shooter");
  let strategyGamesTextButton = document.getElementById('strategy_games_text_button');
  strategyGamesTextButton.onclick = () => consoleGenreSales.showOnly("Strategy");

  // ---------------------------------------------------------------------------
  // PUBLISHER WAR
  // ---------------------------------------------------------------------------
  //--------------------- Top Publisher by Sales -------------------------------
  // Get Data Sales Top10
  let publishers_sales_top10_data_WORLD = dataProcessor.getTop10PublisherSales("Global");
  let publishers_sales_top10_data_NA = dataProcessor.getTop10PublisherSales("NA");
  let publishers_sales_top10_data_EU = dataProcessor.getTop10PublisherSales("EU");
  let publishers_sales_top10_data_JP = dataProcessor.getTop10PublisherSales("JP");
  let publishers_sales_top10_data_OTHER = dataProcessor.getTop10PublisherSales("Other");
  // Set Up Publishers Sales Top 10 graph
  let publisherWarSalesTop10 = new BarChart("publisherSalesTop10_container", "Publishers", "All-Time Sales", publishers_sales_top10_data_WORLD[0], [publishers_sales_top10_data_WORLD[1]], {
    Sales: "#3c3c3c"
  });
  // Get Data Sales over year
  let top10_publishers_sales_year_data_WORLD = dataProcessor.getPublisherSalesYear("Global", publishers_sales_top10_data_WORLD[0]);
  let top10_publishers_sales_year_data_NA = dataProcessor.getPublisherSalesYear("NA", publishers_sales_top10_data_NA[0]);
  let top10_publishers_sales_year_data_EU = dataProcessor.getPublisherSalesYear("EU", publishers_sales_top10_data_EU[0]);
  let top10_publishers_sales_year_data_JP = dataProcessor.getPublisherSalesYear("JP", publishers_sales_top10_data_JP[0]);
  let top10_publishers_sales_year_data_OTHER = dataProcessor.getPublisherSalesYear("Other", publishers_sales_top10_data_OTHER[0]);
  // Set Up Publisher Sales Year
  let typesPublishers_WORLD = {}
  for (let publisher of publishers_sales_top10_data_WORLD[0]) typesPublishers_WORLD[publisher] = 'area-spline';
  let typesPublishers_NA = {}
  for (let publisher of publishers_sales_top10_data_NA[0]) typesPublishers_NA[publisher] = 'area-spline';
  let typesPublishers_EU = {}
  for (let publisher of publishers_sales_top10_data_WORLD[0]) typesPublishers_EU[publisher] = 'area-spline';
  let typesPublishers_JP = {}
  for (let publisher of publishers_sales_top10_data_WORLD[0]) typesPublishers_JP[publisher] = 'area-spline';
  let typesPublishers_OTHER = {}
  for (let publisher of publishers_sales_top10_data_WORLD[0]) typesPublishers_OTHER[publisher] = 'area-spline';
  let colorsPublishers = {
    "Nintendo": "#c22020",
    "Electronic Arts": "#4557a2",
    "Activision" : "#4b402f",
    "Sony Computer Entertainment" : "#00bbff",
    "Ubisoft": "#9bb4bf",
    "Take-Two Interactive": "#d1cb42",
    "THQ": "#b85901",
    "Konami Digital Entertainment" : "#385b33",
    "Sega" : "#331a49",
    "Namco Bandai Games" : "#ff0060",
    "Microsoft Game Studios" : "#16e800",
    "Atari" : "#9f249c",
    "Capcom": "#80af97",
    "Square Enix": "#000186",
    "SquareSoft": "#c7be7f",
    "Enix Corporation": "#7c5277",
    "Tecmo Koei": "#4e4e4e"
  }
  let order_stack_publishers = {
    "Nintendo": 1,
    "Electronic Arts": 2,
    "Activision" : 3,
    "Sony Computer Entertainment" : 4,
    "Ubisoft": 5,
    "Take-Two Interactive": 6,
    "THQ": 7,
    "Konami Digital Entertainment" : 8,
    "Sega" : 9,
    "Namco Bandai Games" : 10,
    "Microsoft Game Studios" : 11,
    "Atari" : 12,
    "Sega" : 13,
    "Capcom": 14,
    "Square Enix": 15,
    "SquareSoft": 16,
    "Enix Corporation": 17,
    "Tecmo Koei": 18
  }
  let publisherWarSalesYears = new StackedAreaChart("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_WORLD, typesPublishers_WORLD, [publishers_sales_top10_data_WORLD[0]], colorsPublishers, order_stack_publishers);


  // Set Up Region Selector
  let publisherWarRegionSelector = new RegionSelector("publishers_war_region_selector")
  publisherWarRegionSelector.selectedRegion = (region) => {
    let container = document.getElementById("publisherSalesTop10_container");
    switch (region) {
      case "WORLD":
        publisherWarSalesTop10.update(publishers_sales_top10_data_WORLD[0], [publishers_sales_top10_data_WORLD[1]]);
        container.classList.add("WORLD");
        container.classList.remove("NA");
        container.classList.remove("EU");
        container.classList.remove("JP");
        container.classList.remove("OTHER");
        setTimeout(() => publisherWarSalesYears.update_full("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_WORLD, typesPublishers_WORLD, [publishers_sales_top10_data_WORLD[0]], colorsPublishers, order_stack_publishers), 200);
        break;
      case "NA":
        publisherWarSalesTop10.update(publishers_sales_top10_data_NA[0], [publishers_sales_top10_data_NA[1]]);
        container.classList.remove("WORLD");
        container.classList.add("NA");
        container.classList.remove("EU");
        container.classList.remove("JP");
        container.classList.remove("OTHER");
        setTimeout(() => publisherWarSalesYears.update_full("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_NA, typesPublishers_NA, [publishers_sales_top10_data_NA[0]], colorsPublishers, order_stack_publishers), 200);
        break;
      case "EU":
        publisherWarSalesTop10.update(publishers_sales_top10_data_EU[0], [publishers_sales_top10_data_EU[1]]);
        container.classList.remove("WORLD");
        container.classList.remove("NA");
        container.classList.add("EU");
        container.classList.remove("JP");
        container.classList.remove("OTHER");
        setTimeout(() => publisherWarSalesYears.update_full("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_EU, typesPublishers_EU, [publishers_sales_top10_data_EU[0]], colorsPublishers, order_stack_publishers), 200);
        break;
      case "JP":
        publisherWarSalesTop10.update(publishers_sales_top10_data_JP[0], [publishers_sales_top10_data_JP[1]]);
        container.classList.remove("WORLD");
        container.classList.remove("NA");
        container.classList.remove("EU");
        container.classList.add("JP");
        container.classList.remove("OTHER");
        setTimeout(() => publisherWarSalesYears.update_full("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_JP, typesPublishers_JP, [publishers_sales_top10_data_JP[0]], colorsPublishers, order_stack_publishers), 200);
        break;
      case "OTHER":
        publisherWarSalesTop10.update(publishers_sales_top10_data_OTHER[0], [publishers_sales_top10_data_OTHER[1]]);
        container.classList.remove("WORLD");
        container.classList.remove("NA");
        container.classList.remove("EU");
        container.classList.remove("JP");
        container.classList.add("OTHER");
        setTimeout(() => publisherWarSalesYears.update_full("publisherSalesYears_container", "Year", "Sales of games released that year", 500, top10_publishers_sales_year_data_OTHER, typesPublishers_OTHER, [publishers_sales_top10_data_OTHER[0]], colorsPublishers, order_stack_publishers), 200);
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // GAME ANALYSIS
  // ---------------------------------------------------------------------------

  // Set up Data Manager
  let dataManager = new DataManager("gameScoreSales_container", data, components_to_update);

  // Set up Scatter Plot
  // TODO : complete args
  let gameScoreSales = new ScatterPlot(...);

  // Set up Time Brush
  // TODO: Create Time Brush

  // Set up Genres Bar Chart
  // TODO: Create Genre Buttons

  // Set up Consoles Bar Chart
  // TODO: Create Consoles Buttons
}
