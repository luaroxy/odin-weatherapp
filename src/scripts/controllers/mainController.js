export default class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    window.addEventListener("load", () => this.callFunc());
  }

  async callFunc() {
    await this.model.getWeatherData("Regina", "metric");
  }
}
