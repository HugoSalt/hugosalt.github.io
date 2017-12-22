export default class LoadingScreen {

  constructor() {
    document.getElementById("loading_text").style.opacity = "1";
    document.getElementById("loading_bar_background").style.opacity = "1";
    console.log("Hello");
  }

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
