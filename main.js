import Menu from "./modules/Menu/Menu.js";
import Banner from "./modules/Banner/Banner.js";

// Set up left side menu
let menu = new Menu("menu_container")
let button = document.getElementById('menu_button')
button.onclick = () => menu.toggle()

// Set Up Animated Top Header
new Banner("banner_container");
