export default class Menu {

  constructor(container_id) {
    this.container_id = container_id;
    // Initialy menu is hidden
    this.hidden = true;
  }

  toggle() {
    let container = document.getElementById(this.container_id)
    if (this.hidden) container.style.transform = "translate3d(0%, 0, 0)";
    else container.style.transform = "translate3d(-100%, 0, 0)";
    this.hidden = !this.hidden;
  }

}
