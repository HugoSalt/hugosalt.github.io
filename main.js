//import * as d3 from "d3";
import Menu from "./modules/menu/menu.js";
import Banner from "./modules/banner/banner.js";

// Set up left side menu
let menu = new Menu("menu_container")
let button = document.getElementById('menu_button')
button.onclick = () => menu.toggle()

// Set Up Animated Top Header
new Banner("banner_container");
