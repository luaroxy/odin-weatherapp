export default class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    window.addEventListener("load", () => this.callFunc());
  }

  async callFunc() {
    const cityInfo = await this.model.getCityInfo("Regina", "metric");
    const currentWeather = await this.model.getCurrentWeather("Regina", "metric");
    const forecastWeather = await this.model.getForecastWeather("Regina", "metric");

    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }
}
