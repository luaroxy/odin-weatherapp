export default class MainController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.city = {};
    this.unit = "metric";

    document.getElementById("search").addEventListener("blur", (e) => this.callFunc(document.getElementById("search").value));
    document.getElementById("search").addEventListener("keypress", (e) => this.checkIfEnter(e));
    window.addEventListener("load", () => this.callFunc("new york"));
    document.getElementById("checkbox-unit").addEventListener("change", (e) => this.changeTemperature(e));
  }

  async callFunc(city) {
    document.getElementById("video").playbackRate = 0.5;

    this.city = city;

    const cityInfo = await this.model.getCityInfo(city, this.unit);
    const currentWeather = await this.model.getCurrentWeather(city, this.unit);
    const forecastWeather = await this.model.getForecastWeather(city, this.unit);

    this.view.appendCityInfo(cityInfo);
    this.view.appendCurrentWeather(currentWeather);
    this.view.appendForecastWeather(forecastWeather);
  }

  checkIfEnter(e) {
    if (e.key === "Enter") document.getElementById("search").blur();
  }

  changeTemperature(e) {
    const unit = e.currentTarget.checked ? "imperial" : "metric";
    this.view.changeUnitTemp(unit);
    this.unit = unit;
    this.callFunc(this.city);
  }
}
