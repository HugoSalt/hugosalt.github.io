import Menu from "./modules/Menu/Menu.js";
import Banner from "./modules/Banner/Banner.js";
import RegionSelector from "./modules/RegionSelector/RegionSelector.js"

// Set up left side menu
let menu = new Menu("menu_container")
let button = document.getElementById('menu_button')
button.onclick = () => menu.toggle()

// Set up animated top header
new Banner("banner_container");

// Set up console popularity over years
// Set up region select
let consoleWarRegionSelector = new RegionSelector("console_war_region_selector")
