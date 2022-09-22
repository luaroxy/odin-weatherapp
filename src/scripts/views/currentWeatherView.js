export default class CurrentWeatherView {
  constructor(element, currentWeatherModel) {
    this.element = element;
    this.model = currentWeatherModel;
    this.weatherConditionImg = currentWeatherModel.weatherConditionImg;
    this.temperature = currentWeatherModel.temperature;
    this.weatherConditionDesc = currentWeatherModel.weatherConditionDesc;
    this.feelsLikeTemp = currentWeatherModel.feelsLikeTemp;
    this.sunrise = currentWeatherModel.sunrise;
    this.sunset = currentWeatherModel.sunset;
    this.humidity = currentWeatherModel.humidity;
    this.windSpeed = currentWeatherModel.windSpeed;
    this.pressure = currentWeatherModel.pressure;
    this.nowWeatherCondition = currentWeatherModel.weatherConditionImg;
    this.nowTemperature = currentWeatherModel.temperature;
    this.backgroundVideo = currentWeatherModel.backgroundVideo;
  }

  get weatherConditionImg() {
    return this.element.querySelector("img");
  }

  set weatherConditionImg(value) {
    this.weatherConditionImg.src = `images/${value}.png`;
  }

  get temperature() {
    return this.element.querySelector("h1");
  }

  set temperature(value) {
    this.temperature.textContent = value;
  }

  get weatherConditionDesc() {
    return this.element.querySelector("h2");
  }

  set weatherConditionDesc(value) {
    this.weatherConditionDesc.textContent = value;
  }

  get feelsLikeTemp() {
    return this.element.querySelector(".feels-like");
  }

  set feelsLikeTemp(value) {
    this.feelsLikeTemp.textContent = value;
  }

  get sunrise() {
    return this.element.querySelector(".sunrise");
  }

  set sunrise(value) {
    this.sunrise.textContent = value;
  }

  get sunset() {
    return this.element.querySelector(".sunset");
  }

  set sunset(value) {
    this.sunset.textContent = value;
  }

  get humidity() {
    return this.element.querySelector(".humidity");
  }

  set humidity(value) {
    this.humidity.textContent = value;
  }

  get windSpeed() {
    return this.element.querySelector(".wind-speed");
  }

  set windSpeed(value) {
    this.windSpeed.textContent = value;
  }

  get pressure() {
    return this.element.querySelector(".pressure");
  }

  set pressure(value) {
    this.pressure.textContent = value;
  }

  get nowWeatherCondition() {
    return document.getElementById("forecast__item__current-condition");
  }

  set nowWeatherCondition(value) {
    this.nowWeatherCondition.src = `images/${value}.png`;
  }

  get nowTemperature() {
    return document.getElementById("forecast__item__curent-temp");
  }

  set nowTemperature(value) {
    this.nowTemperature.textContent = value;
  }

  get backgroundVideo() {
    return document.getElementById("video");
  }

  set backgroundVideo(value) {
    this.backgroundVideo.src = value;
  }
}
