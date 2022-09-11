import CurrentWeather from "./currentWeather";

export default class MainModel {
  constructor() {
    this.data = {};
  }

  // eslint-disable-next-line class-methods-use-this
  async getGeoCoordinates(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&APPID=e52320b984040185e6040a1e67f254e0`;
    const response = await fetch(url, { mode: "cors" });
    const geocodingData = await response.json();

    const { lat, lon } = geocodingData[0];

    return { lat, lon };
  }

  async getCurrentWeatherData(city, unit) {
    const { lat, lon } = await this.getGeoCoordinates(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e52320b984040185e6040a1e67f254e0&units=${unit}`;
    const response = await fetch(url, { mode: "cors" });
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  }

  async getForecast(city, unit) {
    const { lat, lon } = await this.getGeoCoordinates(city);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=8&appid=e52320b984040185e6040a1e67f254e0&units=${unit}`;
    const response = await fetch(url, { mode: "cors" });
    const forecastData = await response.json();
    console.log(forecastData);
    return forecastData;
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.getCurrentWeatherData(city, unit);
    const currentWeather = new CurrentWeather(currentWeatherData);
    console.log(currentWeather);
  }
}
