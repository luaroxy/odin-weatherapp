export default class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    window.addEventListener("load", () => this.callFunc());
  }

  async callFunc() {
    await this.model.getCurrentWeather("Regina", "metric");
    await this.model.getForecastWeather("Regina", "metric");
  }
}
