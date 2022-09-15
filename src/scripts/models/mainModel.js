import CurrentWeather from "./currentWeather";
import ForecastWeather from "./forecastWeather";
import APIs from "./APIs";

export default class MainModel {
  constructor() {
    this.data = {};
    this.APIs = new APIs();
  }

  async getCurrentWeather(city, unit) {
    const currentWeatherData = await this.APIs.getCurrentWeatherData(city, unit);
    const currentWeather = new CurrentWeather(currentWeatherData);
    console.log(currentWeather);
  }

  async getForecastWeather(city, unit) {
    const forecastWeatherData = await this.APIs.getForecastWeatherData(city, unit);
    const forecastWeather = new ForecastWeather(forecastWeatherData);
    console.log(forecastWeather);
  }
}
