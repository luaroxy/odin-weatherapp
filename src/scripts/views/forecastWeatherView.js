export default class forecastWeatherView {
  constructor(element, forecastWeatherModel) {
    this.element = element;
    this.model = forecastWeatherModel;
    this.time = forecastWeatherModel.time;
    this.weatherCondition = forecastWeatherModel.weatherCondition;
    this.temperatures = forecastWeatherModel.temperatures;
  }

  get time() {
    return this.element.querySelectorAll(".forecast__item__time");
  }

  set time(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.time[i].textContent = value[i];
    }
  }

  get weatherCondition() {
    return this.element.querySelectorAll("img");
  }

  set weatherCondition(value) {
    for (let i = 1; i < this.weatherCondition.length; i++) {
      this.weatherCondition[i].src = `images/${value[i - 1]}.png`;
    }
  }

  get temperatures() {
    return this.element.querySelectorAll(".forecast__item__temperature");
  }

  set temperatures(value) {
    for (let i = 0; i < this.time.length; i++) {
      this.temperatures[i].textContent = value[i];
    }
  }
}
