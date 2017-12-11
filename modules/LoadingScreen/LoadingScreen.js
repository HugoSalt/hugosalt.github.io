export default class LoadingScreen {

  constructor() {}

  // percentage = float of progress (eg 0.77)
  setProgress(percentage) {
    let bar = document.getElementById("loading_bar");
    bar.style.width = percentage * 400 + "px";
  }

  hide() {
    let loadingScreen = document.getElementById("loading_screen");
    loadingScreen.style.transform = "translateY(-100%)";
    setTimeout(() => loadingScreen.remove(), 5000);
  }

}
