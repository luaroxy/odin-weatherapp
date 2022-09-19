export default class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    document.getElementById("search").addEventListener("blur", (e) => this.callFunc(document.getElementById("search").value));
    document.getElementById("search").addEventListener("keypress", (e) => this.checkIfEnter(e));
    window.addEventListener("load", () => this.callFunc("new york"));
  }

  async callFunc(city) {
    const cityInfo = await this.model.getCityInfo(city, "metric");
    const currentWeather = await this.model.getCurrentWeather(city, "metric");
    const forecastWeather = await this.model.getForecastWeather(city, "metric");

    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }

  checkIfEnter(e) {
    if (e.key === "Enter") document.getElementById("search").blur();
  }
}
